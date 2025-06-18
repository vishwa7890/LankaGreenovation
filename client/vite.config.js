import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      css: {},
    },
  },
  // ✅ This is the key addition for GitHub Pages
  base: '/Lanka-Greenovation/',
});
