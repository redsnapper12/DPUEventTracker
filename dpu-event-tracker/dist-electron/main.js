import { app, dialog, ipcMain, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
let db = null;
function toCamelCase(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneNumber: row.phone_number,
    email: row.email,
    classYear: row.class_year,
    tag: row.tag,
    createdAt: row.created_at
  };
}
function toCamelCaseArray(rows) {
  return rows.map(toCamelCase);
}
function isDatabaseConfigured() {
  const configPath = path.join(app.getPath("userData"), "db-config.json");
  return fs.existsSync(configPath);
}
async function promptForDatabaseFile() {
  const result = await dialog.showOpenDialog({
    title: "Select Student Directory Database",
    properties: ["openFile"],
    filters: [
      { name: "Database Files", extensions: ["db", "sqlite", "sqlite3"] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    console.log("User canceled database selection");
    return false;
  }
  const selectedPath = result.filePaths[0];
  console.log("Selected database path:", selectedPath);
  try {
    console.log("Attempting to open database...");
    const testDb = new Database(selectedPath, {
      readonly: true,
      fileMustExist: true
    });
    console.log("Database opened successfully");
    console.log("Querying tables...");
    const allTables = testDb.prepare("SELECT * FROM sqlite_master WHERE type='table'").all();
    console.log("=== DATABASE DEBUG ===");
    console.log("All tables:", allTables);
    console.log("Attempting to query students table...");
    const studentCount = testDb.prepare("SELECT COUNT(*) as count FROM students").get();
    console.log("Student count:", studentCount);
    const sampleStudent = testDb.prepare("SELECT * FROM students LIMIT 1").get();
    console.log("Sample student:", sampleStudent);
    console.log("Closing test database...");
    testDb.close();
    console.log("Saving database config...");
    const configPath = path.join(app.getPath("userData"), "db-config.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({ databasePath: selectedPath })
    );
    console.log("✅ Database configured successfully:", selectedPath);
    return true;
  } catch (error) {
    console.error("❌ DATABASE ERROR:", error);
    console.error("Error stack:", error.stack);
    dialog.showErrorBox("Database Error", `${error.message}`);
    return false;
  }
}
function initDatabase() {
  const configPath = path.join(app.getPath("userData"), "db-config.json");
  if (!fs.existsSync(configPath)) {
    return false;
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const dbPath = config.databasePath;
  if (!fs.existsSync(dbPath)) {
    return false;
  }
  db = new Database(dbPath, { readonly: true });
  console.log("Database initialized:", dbPath);
  return true;
}
function getDatabase() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
function resetDatabaseConfig() {
  closeDatabase();
  const configPath = path.join(app.getPath("userData"), "db-config.json");
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}
function getAllStudents() {
  const stmt = getDatabase().prepare(
    "SELECT * FROM students ORDER BY last_name, first_name"
  );
  const results = stmt.all();
  return toCamelCaseArray(results);
}
function searchStudents(searchTerm) {
  const stmt = getDatabase().prepare(`
    SELECT * FROM students 
    WHERE first_name LIKE ? 
       OR last_name LIKE ? 
       OR email LIKE ?
    ORDER BY last_name, first_name
  `);
  const term = `%${searchTerm}%`;
  const results = stmt.all(term, term, term);
  return toCamelCaseArray(results);
}
function registerIpcHandlers() {
  ipcMain.handle("db:isConfigured", async () => {
    return { success: true, data: isDatabaseConfigured() };
  });
  ipcMain.handle("db:promptForFile", async () => {
    const result = await promptForDatabaseFile();
    if (result) {
      initDatabase();
    }
    return { success: result };
  });
  ipcMain.handle("db:reset", async () => {
    resetDatabaseConfig();
    return { success: true };
  });
  ipcMain.handle("db:getAllStudents", async () => {
    try {
      return { success: true, data: getAllStudents() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db:searchStudents", async (_event, searchTerm) => {
    try {
      return { success: true, data: searchStudents(searchTerm) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const BROWSER_WINDOW_WIDTH = 1280;
const BROWSER_WINDOW_HEIGHT = 720;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: BROWSER_WINDOW_WIDTH,
    height: BROWSER_WINDOW_HEIGHT,
    minWidth: BROWSER_WINDOW_WIDTH / 2,
    minHeight: BROWSER_WINDOW_HEIGHT / 2,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  try {
    registerIpcHandlers();
    if (isDatabaseConfigured()) {
      initDatabase();
    }
    createWindow();
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
}).catch((error) => {
  console.error("Error in app.whenReady:", error);
});
app.on("before-quit", () => {
  closeDatabase();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
