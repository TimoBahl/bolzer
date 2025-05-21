import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bolzer-8d71d-default-rtdb.europe-west1.firebasedatabase.app",
});

// eslint-disable-next-line require-jsdoc
async function getSpieltage() {
  const matchDays = 34;  

  for (let spieltag = 1; spieltag <= matchDays; spieltag++) {
    const url = `https://api.openligadb.de/getmatchdata/bl1/2024/${spieltag}`;

    try {
      const response = await axios.get(url);
      await admin.database().ref(`/spieltag_new/${spieltag}`).set(
        response.data.map(match => {
          const endResult = match.matchResults?.find(r => r.resultTypeID === 2);
          return {
            matchID: match.matchID,
            matchDateTime: match.matchDateTime,
            homeTeam: match.team1?.teamName,
            awayTeam: match.team2?.teamName,
            homeTeamScore: endResult?.pointsTeam1 ?? null,
            awayTeamScore: endResult?.pointsTeam2 ?? null,
          };
        }));
      console.log(`Spieltage gespeichert.`);
    } catch (error) {
      console.error(`Fehler bei Spieltage:`, error.message);
    }
  }
  await admin.app().delete();
}
getSpieltage();
