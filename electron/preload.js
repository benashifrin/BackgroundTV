// electron/preload.js
// Minimal, safe API surface exposed to the renderer.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openExternal: async (url) => {
    try {
      if (typeof url === 'string' && url.startsWith('http')) {
        // Log to main process for visibility in the terminal
        try { ipcRenderer.send('telemetry:openExternal', url); } catch (_) {}
        // Ask main process to open externally (more reliable across sandboxes)
        await ipcRenderer.invoke('open-external', url);
      }
    } catch (e) {
      // swallow; nothing sensitive
    }
  }
});
