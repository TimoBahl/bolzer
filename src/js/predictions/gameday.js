import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export async function loadDataForGameday(spieltag) {
  const liste = document.getElementById("tippabgabe-liste");
  liste.innerHTML = ""; // Vorherige Spiele entfernen

  try {
    const spieleSnapshot = await getDocs(collection(db, "spieltage", spieltag, "spiele"));

    spieleSnapshot.forEach((doc) => {
      const spiel = doc.data();

      const li = document.createElement("li");
      li.className = "grid grid-cols-1 md:grid-cols-3 gap-4 items-center";
      li.setAttribute("data-game-id", doc.id);
      li.innerHTML = `
        <div id="homeTeam-${doc.id}" class="text-center md:text-left font-semibold text-gray-900 dark:text-white">${spiel.heim}</div>
        <div class="flex space-x-2 justify-center">
          <input type="number" class="homeTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore">
          <span class="text-gray-500">:</span>
          <input type="number" class="awayTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore">
        </div>
        <div id="awayTeam-${doc.id}" class="text-center md:text-right font-semibold text-gray-900 dark:text-white">${spiel.gast}</div>
      `;
      liste.appendChild(li);
    });

    if (spieleSnapshot.empty) {
      liste.innerHTML = "<li class='text-center text-gray-500'>Keine Spiele gefunden.</li>";
    }
  } catch (error) {
    console.error("Fehler beim Laden der Spiele:", error);
  }
}