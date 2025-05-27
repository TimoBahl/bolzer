import { resolve } from "path";
import { defineConfig } from "vite";
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  build: {
    outDir: "dist", // Zielordner für den Build (Standard: dist)
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        home: resolve(__dirname, "src/html/home.html"),
        prediction: resolve(__dirname, "src/html/prediction.html"),
        leaderboard: resolve(__dirname, "src/html/leaderboard.html"),
      },
    },
  },
  server: {
    open: true, // Öffnet den Browser automatisch, wenn der Server startet
  },
  plugins: [injectHTML()],
});

