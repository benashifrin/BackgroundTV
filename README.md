# BackgroundReferralTV – Live Wallpaper (Electron + React)

An Electron app that loads a React UI (animated gradient background, welcome text, rotating QR codes, and a 10‑country video launcher) and re‑parents the window to Windows' WorkerW so it renders behind desktop icons like a live wallpaper.

## Quick Start (Windows 10/11)

1) Install Node.js 18+ (x64). Install C++ build tools for native modules (VS Build Tools 2019/2022).

2) Install dependencies:
```
npm install
```

3) Build the React UI:
```
npm run build:react
```

4) Run Electron:
```
npm run dev
```
This launches fullscreen and attaches behind icons. For interactive foreground mode, comment the `await attachToWorkerw(mainWindow);` line in `electron/main.js` and run again.

5) Create a Windows installer:
```
npm run dist
```

## Project Structure
```
project-root/
├─ electron/           # Electron entry, preload, WorkerW attach
├─ react-app/          # Vite + React UI (built to dist/)
├─ package.json        # Root app, scripts, electron-builder config
└─ README.md
```

## Notes
- Security: `contextIsolation: true`, `nodeIntegration: false`; only exposes `openExternal(url)` via preload.
- UI: QR codes rotate every 30s with a fade. Video buttons open YouTube in the default browser.
- Native APIs: Uses `ffi-napi` + `ref-napi` to call Win32 for WorkerW attach.
- Requirements: Add `build/icon.ico` before packaging, or update the builder config.

## Scripts
- `npm run dev`: Build React then run Electron.
- `npm run build:react`: Vite production build to `react-app/dist`.
- `npm run dist`: Package Windows installer via electron-builder.
