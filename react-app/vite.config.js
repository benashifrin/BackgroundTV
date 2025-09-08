import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use relative base so built assets work via file:// in Electron
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

