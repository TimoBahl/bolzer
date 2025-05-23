import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function loadDataForGameday(spieltag, user) {
  const liste = document.getElementById("tippabgabe-liste");
  liste.innerHTML = "";
  try {
    const spieleSnapshot = await getDocs(
      collection(db, "spieltage", spieltag, "spiele")
    );

    let userPredictions = {};

    if (user) {
      const predictionsSnapshot = await getDocs(
        collection(db, "users", user.uid, "tipps")
      );
      predictionsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.gameday === spieltag) {
          userPredictions[doc.id] = data;
        }
      });
    }

    spieleSnapshot.forEach((doc) => {
      const spiel = doc.data();
      const spielId = doc.id;

      const prediction = userPredictions[spielId] || {};
      const toreHeim = prediction.toreHeim ?? "";
      const toreGast = prediction.toreGast ?? "";

      const li = document.createElement("li");
      li.className = "grid grid-cols-1 md:grid-cols-3 gap-4 items-center";
      li.setAttribute("data-game-id", spielId);
      li.innerHTML = `
          <div id="homeTeam-${spielId}" class="text-center md:text-left font-semibold text-gray-900 dark:text-white">${spiel.heim}</div>
          <div class="flex space-x-2 justify-center">
            <input type="number" class="homeTeamResult w-16 border border-gray-300 text-gray-500 rounded-md py-2 text-center" placeholder="Tore" value="${toreHeim}">
            <span class="text-gray-500">:</span>
            <input type="number" class="awayTeamResult w-16 border border-gray-300 text-gray-500 rounded-md py-2 text-center" placeholder="Tore" value="${toreGast}">
          </div>
          <div id="awayTeam-${spielId}" class="text-center md:text-right font-semibold text-gray-900 dark:text-white">${spiel.gast}</div>
        `;
      liste.appendChild(li);
    });

    if (spieleSnapshot.empty) {
      liste.innerHTML =
        "<li class='text-center text-gray-500'>Keine Spiele gefunden.</li>";
    }
  } catch (error) {
    console.error("Fehler beim Laden der Spiele:", error);
  }
}
