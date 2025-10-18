import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

// Database API
contextBridge.exposeInMainWorld("electronAPI", {
  db: {
    isConfigured: () => ipcRenderer.invoke("db:isConfigured"),
    promptForFile: () => ipcRenderer.invoke("db:promptForFile"),
    reset: () => ipcRenderer.invoke("db:reset"),
    getAllStudents: () => ipcRenderer.invoke("db:getAllStudents"),
    searchStudents: (searchTerm: string) =>
      ipcRenderer.invoke("db:searchStudents", searchTerm),
  },
});
