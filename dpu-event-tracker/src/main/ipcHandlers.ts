import { ipcMain } from 'electron';
import * as db from './database';

export function registerIpcHandlers() {
  ipcMain.handle('db:isConfigured', async () => {
    return { success: true, data: db.isDatabaseConfigured() };
  });

  ipcMain.handle('db:promptForFile', async () => {
    const result = await db.promptForDatabaseFile();
    if (result) {
      db.initDatabase();
    }
    return { success: result };
  });

  ipcMain.handle('db:reset', async () => {
    db.resetDatabaseConfig();
    return { success: true };
  });

  ipcMain.handle('db:getAllStudents', async () => {
    try {
      return { success: true, data: db.getAllStudents() };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('db:searchStudents', async (_event, searchTerm: string) => {
    try {
      return { success: true, data: db.searchStudents(searchTerm) };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}