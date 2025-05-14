import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',  // Zielordner für den Build (Standard: dist)
    rollupOptions: {
      input: './index.html'  // Die HTML-Datei, die als Einstiegspunkt dient
    }
  },
  server: {
    open: true,  // Öffnet den Browser automatisch, wenn der Server startet
  }
});