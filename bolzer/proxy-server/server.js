// proxy-server/server.js
import express from "express";
import fetch from "node-fetch"; // Für Node 18+ kannst du fetch nativ nutzen

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  // CORS Header setzen, damit dein Frontend auf localhost:xxxx zugreifen kann
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy-Route für OpenLigaDB
app.get('/api/matches', async (req, res) => {
  try {
    const response = await fetch('https://www.openligadb.de/api/getmatchdata/bl1');
    const data = await response.json();
    console.log('API response:', data);  // <--- Log-Ausgabe prüfen
    res.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Daten' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server läuft auf http://localhost:${PORT}`);
});
