import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build to dist/ with hashless filenames (safer file:// loads)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

