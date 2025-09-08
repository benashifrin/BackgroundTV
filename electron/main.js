// electron/main.js
// Creates fullscreen window and attaches to Windows desktop "WorkerW" (behind icons)

const path = require('path');
const { app, BrowserWindow, shell, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
console.log('[electron] main starting');

const isWin = process.platform === 'win32';
const safeMode = process.env.SAFE_MODE === '1';
console.log('[electron] isWin=', isWin, 'SAFE_MODE=', safeMode, 'NO_ATTACH=', process.env.NO_ATTACH);

// In safe mode, disable GPU to avoid possible freezes with transparent fullscreen windows
try {
  if (safeMode) {
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-gpu-compositing');
  }
} catch (_) {}

// Win32 FFI to attach window to WorkerW
let attachToWorkerw = async (win) => {
  if (!isWin) return false;

  // Lazy-require natives to avoid mac/linux crashes
  const ffi = require('ffi-napi');
  const ref = require('ref-napi');

  const voidPtr = ref.refType(ref.types.void);

  // helper: make a UTF-16LE null-terminated buffer
  const wstr = (s) => Buffer.from(s + '\0', 'ucs2');

  // User32 functions (pointers instead of 'long' to be 64-bit safe)
  const user32 = ffi.Library('user32', {
    'FindWindowW': [voidPtr, ['pointer', 'pointer']],
    'FindWindowExW': [voidPtr, ['pointer', 'pointer', 'pointer', 'pointer']],
    'SendMessageTimeoutW': ['uint32', ['pointer', 'uint32', 'pointer', 'pointer', 'uint32', 'uint32', 'pointer']],
    'EnumWindows': ['bool', ['pointer', 'pointer']],
    'SetParent': ['pointer', ['pointer', 'pointer']]
  });

  // Magic message to Progman to spawn a WorkerW host behind icons
  const WM_SPAWN_WORKERW = 0x052C;

  // 1) Find PROGMAN and force-create WorkerW
  const progman = user32.FindWindowW(wstr('Progman'), null);
  if (ref.isNull(progman)) return false;

  const lpdwResult = ref.alloc('ulong');
  user32.SendMessageTimeoutW(
    progman,
    WM_SPAWN_WORKERW,
    ref.NULL,
    ref.NULL,
    /* SMTO_NORMAL */ 0x0000,
    /* 1 second */ 1000,
    lpdwResult
  );

  // 2) Find a WorkerW that hosts SHELLDLL_DefView sibling
  // EnumWindows callback: BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
  let workerwHwnd = ref.NULL;

  const enumProc = ffi.Callback('bool', ['pointer', 'pointer'], (hwnd, lParam) => {
    // If this window has a child "SHELLDLL_DefView", then the next WorkerW is our target
    const shellView = user32.FindWindowExW(hwnd, ref.NULL, wstr('SHELLDLL_DefView'), null);
    if (!ref.isNull(shellView)) {
      // Find WorkerW after this hwnd
      const workerw = user32.FindWindowExW(ref.NULL, hwnd, wstr('WorkerW'), null);
      if (!ref.isNull(workerw)) {
        workerwHwnd = workerw;
        return false; // stop enumeration
      }
    }
    return true; // continue
  });

  user32.EnumWindows(enumProc, ref.NULL);

  if (ref.isNull(workerwHwnd)) {
    // Fallback: try to parent to Progman itself (works on some builds)
    workerwHwnd = progman;
  }

  // 3) SetParent(electronHWND, workerwHwnd)
  const nativeHandle = win.getNativeWindowHandle(); // Buffer (HWND)
  const result = user32.SetParent(nativeHandle, workerwHwnd);
  return !ref.isNull(result);
};

let mainWindow;
let tray = null;

function createTray() {
  try {
    const iconPath = path.join(__dirname, '..', 'build', 'icon.ico');
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon && !icon.isEmpty() ? icon : nativeImage.createEmpty());
    tray.setToolTip('LiveWallpaper');
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Window',
        click: () => {
          try {
            if (mainWindow) {
              if (mainWindow.isMinimized()) mainWindow.restore();
              mainWindow.show();
              mainWindow.focus();
            }
          } catch (_) {}
        },
      },
      { type: 'separator' },
      {
        label: 'Quit (Ctrl+Alt+Q)',
        click: () => { try { app.quit(); } catch (_) {} },
      },
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      try {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      } catch (_) {}
    });
  } catch (_) {}
}

const createWindow = async () => {
  console.log('[electron] creating BrowserWindow...');
  mainWindow = new BrowserWindow({
    width: safeMode ? 1280 : 1920,
    height: safeMode ? 800 : 1080,
    frame: safeMode ? true : false,
    fullscreen: safeMode ? false : true,
    resizable: safeMode ? true : false,
    transparent: safeMode ? false : true,                 // avoid transparent fullscreen in safe mode
    backgroundColor: safeMode ? '#000000' : '#00000000',  // solid in safe mode
    show: false,                                          // show after ready-to-show to avoid flicker
    autoHideMenuBar: !safeMode,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      sandbox: true
    }
  });

  // Load UI: dev server when provided, else built files
  const devUrl = process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_START_URL;
  if (devUrl) {
    console.log('[electron] loading dev URL:', devUrl);
    await mainWindow.loadURL(devUrl);
  } else {
    const indexPath = path.join(__dirname, '..', 'react-app', 'dist', 'index.html');
    console.log('[electron] loading file:', indexPath);
    await mainWindow.loadFile(indexPath);
  }

  mainWindow.once('ready-to-show', async () => {
    console.log('[electron] ready-to-show');
    mainWindow.show();

    // Attach behind icons (WorkerW). Set NO_ATTACH=1 to keep interactive foreground mode.
    const shouldAttach = process.env.NO_ATTACH !== '1' && !app.isPackaged;
    if (shouldAttach) {
      console.log('[electron] attaching to WorkerW...');
      await attachToWorkerw(mainWindow);
    } else {
      console.log('[electron] skipping WorkerW attach (NO_ATTACH=1 or packaged)');
    }
  });

  // Ensure window.open and target=_blank open in the user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
        console.log(`[electron] window.open -> ${url}`);
        shell.openExternal(url);
      } else {
        console.log(`[electron] window.open blocked (non-http): ${url}`);
      }
    } catch (_) {}
    return { action: 'deny' };
  });

  // Log requests from preload bridge (openExternal telemetry)
  ipcMain.on('telemetry:openExternal', (_event, url) => {
    if (typeof url === 'string') {
      console.log(`[electron] preload openExternal -> ${url}`);
    }
  });

  // Handle secure open-external requests from preload/renderer
  ipcMain.handle('open-external', async (_event, url) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return false;
    try {
      console.log(`[electron] ipc openExternal -> ${url}`);
      await shell.openExternal(url);
      return true;
    } catch (err) {
      console.error('[electron] openExternal failed:', err);
      return false;
    }
  });

  // Keep size synced with display changes
  mainWindow.on('resize', () => {
    const [w, h] = mainWindow.getSize();
    mainWindow.setSize(w, h);
  });

  mainWindow.on('closed', () => (mainWindow = null));
};

app.whenReady().then(() => {
  console.log('[electron] app ready');
  createWindow();
  createTray();
  try { globalShortcut.register('Control+Alt+Q', () => app.quit()); } catch (_) {}

  app.on('activate', () => {
    console.log('[electron] app activate');
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On Windows we’ll quit when the window closes.
  app.quit();
});
