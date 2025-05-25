import axios from "axios";
import admin from "firebase-admin";

// Service Account aus GitHub Secret laden
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase Admin initialisieren
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Hauptfunktion zum Abrufen und Speichern der Spieltage
async function getSpieltage() {
  const matchDays = 34;

  for (let spieltag = 1; spieltag <= matchDays; spieltag++) {
    const url = `https://api.openligadb.de/getmatchdata/bl1/2024/${spieltag}`;

    try {
      const response = await axios.get(url);
      const batch = db.batch();

      // Spieltag-Dokument (z. B. für spätere Start-/Enddatum-Daten vorbereiten)
      const spieltagRef = db.collection("spieltage").doc(spieltag.toString());

      const alleSpielzeiten = response.data.map(match => new Date(match.matchDateTime));
      const letzterZeitpunkt = new Date(Math.max(...alleSpielzeiten.map(d => d.getTime())));

      batch.set(spieltagRef, {
        spieltagNummer: spieltag,
        ersterZeitpunkt: admin.firestore.Timestamp.fromDate(ersterZeitpunkt),
        letzterZeitpunkt: admin.firestore.Timestamp.fromDate(letzterZeitpunkt)
      }, { merge: true });

      // Alle Spiele zu diesem Spieltag einfügen
      response.data.forEach((match) => {
        const endResult = match.matchResults?.find((r) => r.resultTypeID === 2);

        const matchData = {
          heim: match.team1?.teamName ?? null,
          gast: match.team2?.teamName ?? null,
          datum: match.matchDateTime,
          ergebnis: endResult
            ? {
                toreHeim: endResult.pointsTeam1,
                toreGast: endResult.pointsTeam2,
              }
            : null,
        };

        const matchRef = spieltagRef.collection("spiele").doc(match.matchID.toString());
        batch.set(matchRef, matchData);
      });

      await batch.commit();
      console.log(`✅ Spieltag ${spieltag} erfolgreich gespeichert.`);
    } catch (error) {
      console.error(`❌ Fehler bei Spieltag ${spieltag}:`, error.message);
    }
  }

  // Admin SDK sauber beenden
  await admin.app().delete();
}

// Funktion starten
getSpieltage();
