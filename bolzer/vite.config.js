import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // Zielordner für den Build (Standard: dist)
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        home: resolve(__dirname, "./home.html"),
        prediction: resolve(__dirname, "./prediction.html"),
      },
    },
  },
  server: {
    open: true, // Öffnet den Browser automatisch, wenn der Server startet
  },
});
