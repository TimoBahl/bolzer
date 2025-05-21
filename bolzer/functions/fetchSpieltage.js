const axios = require("axios");
const admin = require("firebase-admin");

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bolzer-8d71d-default-rtdb.europe-west1.firebasedatabase.app",
});

// eslint-disable-next-line require-jsdoc
async function getSpieltage() {
  const matchDays = 34;
  let fehler = 0;

  for (let spieltag = 1; spieltag <= matchDays; spieltag++) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4331&r=${spieltag}&s=2024-2025`;

    try {
      const response = await axios.get(url);
      await admin.database().ref(`/spieltag/${spieltag}`).set(response.data);
      console.log(`Spieltag ${spieltag} gespeichert.`);
    } catch (error) {
      console.error(`Fehler bei Spieltag ${spieltag}:`, error.message);
      fehler++;
    }
  }

  await admin.app().delete();


  if (fehler > 0) {
    process.exit(1); // fehlerhaft
  } else {
    process.exit(0); // erfolgreich
  }
}

getSpieltage();
