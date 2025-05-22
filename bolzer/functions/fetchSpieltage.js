import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// eslint-disable-next-line require-jsdoc
async function getSpieltage() {
  const matchDays = 34;

  for (let spieltag = 1; spieltag <= matchDays; spieltag++) {
    const url = `https://api.openligadb.de/getmatchdata/bl1/2024/${spieltag}`;

    try {
      const response = await axios.get(url);
      const batch = admin.firestore.batch();

      response.data.forEach((match) => {
        const endResult = match.matchResults?.find((r) => r.resultTypeID === 2);
        const matchData = {
          matchID: match.matchID,
          matchDateTime: match.matchDateTime,
          homeTeam: match.team1?.teamName,
          awayTeam: match.team2?.teamName,
          homeTeamScore: endResult?.pointsTeam1 ?? null,
          awayTeamScore: endResult?.pointsTeam2 ?? null,
          spieltag: spieltag,
        };

        const docRef = db
          .collection("spieltage")
          .doc(spieltag.toString())
          .collection("spiele")
          .doc(match.matchID.toString());

        batch.set(docRef, matchData);
      });

      await batch.commit();
      console.log(`Spieltag ${spieltag} erfolgreich gespeichert.`);
    } catch (error) {
      console.error(`Fehler bei Spieltag ${spieltag}:`, error.message);
    }
  }

  await admin.app().delete();
}

getSpieltage();
