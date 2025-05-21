import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://bolzer-8d71d-default-rtdb.europe-west1.firebasedatabase.app",
});

async function getTabelle() {
  const url = `https://api.openligadb.de/getbltable/bl1/2024`;

  try {
    const response = await axios.get(url);
    const rawTabelle = response.data;
    const tabelleObj = {};
    rawTabelle.forEach((team, index) => {
      const platz = index + 1;
      tabelleObj[platz] = {
        teamName: team.teamName,
        points: team.points,
        diff: team.goalDiff,
        matches: team.matches
      };
    });

    await admin.database().ref(`/tabelle`).set(tabelleObj);
    console.log(`Bundesliga Tabelle gespeichert.`);
  } catch (error) {
    console.error(`Fehler beim speicher der Bundesliga Tabelle:`, error.message);
}
  await admin.app().delete();
}
getTabelle();
