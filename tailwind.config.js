/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/html/home.html",
    "./src/html/prediction.html",
    "./src/html/leaderboard.html",
    // Füge hier weitere HTML-Dateien oder JavaScript-Dateien hinzu,
    // in denen du Tailwind-Klassen verwendest.
    // Beispiel für JavaScript-Dateien im src-Ordner: "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

