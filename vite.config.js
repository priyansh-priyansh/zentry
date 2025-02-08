import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures correct asset paths
  build: {
    outDir: 'dist', // Ensures files are built inside dist
    assetsDir: 'assets', // Puts assets inside dist/assets
    manifest: true, // Helps track generated assets
  },
});