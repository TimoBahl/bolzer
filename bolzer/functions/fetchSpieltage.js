import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: _credential.cert(serviceAccount),
  databaseURL: "https://bolzer-8d71d-default-rtdb.europe-west1.firebasedatabase.app",
});

// eslint-disable-next-line require-jsdoc
async function getSpieltage() {
  const url = `https://api.openligadb.de/getmatchdata/bl1/2024`;

    try {
      const response = await axios.get(url);
      await database().ref(`/spieltag_new/`).set(response.data);
      console.log(`Spieltage gespeichert.`);
    } catch (error) {
      console.error(`Fehler bei Spieltage:`, error.message);
    }
  }

  await admin.app().delete();

getSpieltage();
