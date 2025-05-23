import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function getTabelle() {
  const url = `https://api.openligadb.de/getbltable/bl1/2024`;

  try {
    const response = await axios.get(url);
    const rawTabelle = response.data;
    
    const batch = db.batch

    rawTabelle.forEach((team, index) => {
      const platz = index + 1;
      const teamDocRef = db.collection("bundesligaTabelle").doc(platz.toString());

      batch.set(teamDocRef, {
        teamName: team.teamName,
        points: team.points,
        teamGoals: team.goals,
        opponentGoals: team.opponentGoals,
        diff: team.goalDiff,
        matches: team.matches
      });
    });

    await batch.commit();
    console.log("Bundesliga Tabelle erfolgreich in Firestore gespeichert.");
  } catch (error) {
    console.error("Fehler beim Speichern der Bundesliga Tabelle:", error.message);
  } finally {
    await admin.app().delete();
  }
}

getTabelle();
