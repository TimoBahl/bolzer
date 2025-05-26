import admin from "firebase-admin";
import { calculatePoints } from "../logic/calculationSystem.js";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export async function evaluateAndSaveTips(spiele, allUserTipps) {
  for (const [userId, tipps] of Object.entries(allUserTipps)) {
    for (const spiel of spiele) {
      const tipp = tipps[spiel.id];
      if (!tipp) continue;

      const ergebnis = {
        home: spiel.toreHeim,
        away: spiel.toreGast,
      };

      if (ergebnis.heim == null || ergebnis.aus == null) continue;

      const points = calculatePoints(ergebnis, tipp);

      await db
        .collection("users")
        .doc(userId)
        .collection("tipps")
        .doc(spiel.id)
        .update({ points });
    }
  }
}
