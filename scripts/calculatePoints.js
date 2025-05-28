import { getLastMatchday } from "./firestore/getLastMatchday.js";
import { loadUserTips } from "./firestore/loadUserTips.js";
import { evaluateAndSaveTips } from "./firestore/updatePoints.js";

(async () => {
  const lastMatchday = await getLastMatchday();
  if (!lastMatchday) {
    console.log("Kein letzter Spieltag gefunden.");
    return;
  }

  const spielIds = lastMatchday.spiele.map((s) => s.id.toString());

  console.log(
    `Lade Tipps für Spieltag ${lastMatchday.spieltagId} mit ${spielIds.length} Spielen`
  );

  const userTips = await loadUserTips(spielIds);
  await evaluateAndSaveTips(lastMatchday.spiele, userTips);

  console.log("Tipps bewertet und im Firestore gespeichert");
})();
