import Database from "better-sqlite3";
import { app, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";

let db: Database.Database | null = null;

// Helper to convert snake_case database results to camelCase
function toCamelCase(row: any): any {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    preferredName: row.preferred_name,
    phoneNumber: row.phone_number,
    email: row.email,
    classYear: row.class_year,
    tag: row.tag,
  };
}

function toCamelCaseArray(rows: any[]): any[] {
  return rows.map(toCamelCase);
}

export function isDatabaseConfigured(): boolean {
  const configPath = path.join(app.getPath("userData"), "db-config.json");
  return fs.existsSync(configPath);
}

export async function promptForDatabaseFile(): Promise<boolean> {
  const result = await dialog.showOpenDialog({
    title: "Select Student Directory Database",
    properties: ["openFile"],
    filters: [
      { name: "Database Files", extensions: ["db", "sqlite", "sqlite3"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return false;
  }

  const selectedPath = result.filePaths[0];

  try {
    const testDb = new Database(selectedPath, {
      readonly: true,
      fileMustExist: true,
    });
    
    // Quick validation - check if students table exists
    testDb.prepare("SELECT COUNT(*) FROM students").get();
    testDb.close();

    // Save the path
    const configPath = path.join(app.getPath("userData"), "db-config.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({ databasePath: selectedPath })
    );

    return true;
  } catch (error) {
    dialog.showErrorBox(
      "Database Error", 
      `Failed to open database: ${(error as Error).message}`
    );
    return false;
  }
}

export function initDatabase(): boolean {
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

export function getDatabase(): Database.Database {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDatabaseConfig() {
  closeDatabase();
  const configPath = path.join(app.getPath("userData"), "db-config.json");
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}

// Query functions
export function getAllStudents() {
  const stmt = getDatabase().prepare(
    "SELECT * FROM students ORDER BY last_name, first_name"
  );
  const results = stmt.all();
  return toCamelCaseArray(results);
}

export function searchStudents(searchTerm: string) {
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

export function getStudentsByTag(tag: string) {
  const stmt = getDatabase().prepare(
    "SELECT * FROM students WHERE tag = ? ORDER BY last_name, first_name"
  );
  const results = stmt.all(tag);
  return toCamelCaseArray(results);
}
