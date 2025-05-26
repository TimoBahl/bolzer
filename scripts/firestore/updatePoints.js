import { db } from "./firebaseAdmin.js";
import { calculation } from "../logic/calculationSystem.js";

export async function evaluateAndSaveTips(spiele, allUserTipps) {
  for (const [userId, tipps] of Object.entries(allUserTipps)) {
    for (const spiel of spiele) {
      const tipp = tipps[spiel.id];
      if (!tipp) continue;

      const ergebnis = {
        home: spiel.toreHeim,
        away: spiel.toreGast,
      };

      if (ergebnis.home == null || ergebnis.away == null) continue;

      const points = calculation(ergebnis, tipp);

      await db
        .collection("users")
        .doc(userId)
        .collection("tipps")
        .doc(spiel.id)
        .update({ points });
    }
  }
}
