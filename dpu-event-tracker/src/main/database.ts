import Database from 'better-sqlite3';
import { app, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

let db: Database.Database | null = null;

// Helper to convert snake_case database results to camelCase
function toCamelCase(row: any): any {
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

function toCamelCaseArray(rows: any[]): any[] {
  return rows.map(toCamelCase);
}

export function isDatabaseConfigured(): boolean {
  const configPath = path.join(app.getPath('userData'), 'db-config.json');
  return fs.existsSync(configPath);
}

export async function promptForDatabaseFile(): Promise<boolean> {
  const result = await dialog.showOpenDialog({
    title: 'Select Student Directory Database',
    properties: ['openFile'],
    filters: [
      { name: 'Database Files', extensions: ['db', 'sqlite', 'sqlite3'] },
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    console.log('User canceled database selection');
    return false;
  }

  const selectedPath = result.filePaths[0];
  console.log('Selected database path:', selectedPath);
  
  try {
    console.log('Attempting to open database...');
    const testDb = new Database(selectedPath, { 
      readonly: true,
      fileMustExist: true
    });
    
    console.log('Database opened successfully');
    
    // List ALL tables
    console.log('Querying tables...');
    const allTables = testDb.prepare(
      "SELECT * FROM sqlite_master WHERE type='table'"
    ).all();
    
    console.log('=== DATABASE DEBUG ===');
    console.log('All tables:', allTables);
    
    // Try to query students table directly
    console.log('Attempting to query students table...');
    const studentCount = testDb.prepare("SELECT COUNT(*) as count FROM students").get();
    console.log('Student count:', studentCount);
    
    const sampleStudent = testDb.prepare("SELECT * FROM students LIMIT 1").get();
    console.log('Sample student:', sampleStudent);
    
    console.log('Closing test database...');
    testDb.close();
    
    // Save the path
    console.log('Saving database config...');
    const configPath = path.join(app.getPath('userData'), 'db-config.json');
    fs.writeFileSync(configPath, JSON.stringify({ databasePath: selectedPath }));
    
    console.log('✅ Database configured successfully:', selectedPath);
    return true;
    
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    console.error('Error stack:', (error as Error).stack);
    dialog.showErrorBox('Database Error', `${(error as Error).message}`);
    return false;
  }
}

export function initDatabase(): boolean {
  const configPath = path.join(app.getPath('userData'), 'db-config.json');
  
  if (!fs.existsSync(configPath)) {
    return false;
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const dbPath = config.databasePath;
  
  if (!fs.existsSync(dbPath)) {
    return false;
  }
  
  db = new Database(dbPath, { readonly: true });
  console.log('Database initialized:', dbPath);
  return true;
}

export function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized');
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
  const configPath = path.join(app.getPath('userData'), 'db-config.json');
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}

// Query functions
export function getAllStudents() {
  const stmt = getDatabase().prepare('SELECT * FROM students ORDER BY last_name, first_name');
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
  const stmt = getDatabase().prepare('SELECT * FROM students WHERE tag = ? ORDER BY last_name, first_name');
  const results = stmt.all(tag);
  return toCamelCaseArray(results);
}