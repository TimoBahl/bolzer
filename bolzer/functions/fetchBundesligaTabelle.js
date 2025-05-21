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

    await admin.database().ref(`/tabelle`).set(response.data);
    console.log(`Bundesliga Tabelle gespeichert.`);
  } catch (error) {
    console.error(`Fehler beim speicher der Bundesliga Tabelle:`, error.message);
}
  await admin.app().delete();
}
getTabelle();
