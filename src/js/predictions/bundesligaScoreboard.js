import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function loadBundesligaScoreboardFromDB() {
  const tabelleBody = document.getElementById("bundesliga-tabelle-body");
  tabelleBody.innerHTML = "";

  try {
    const tabelleRef = collection(db, "bundesligaTabelle");
    const snapshot = await getDocs(tabelleRef);

    const teams = snapshot.docs
      .map(doc => ({ id: parseInt(doc.id), ...doc.data() }))
      .sort((a, b) => a.id - b.id);

    teams.forEach((team) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${team.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center gap-6">
          <img src="${team.teamIconUrl}" alt="" class="w-6 h-6 object-contain" />
          <span>${team.teamName}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">${team.teamGoals}:${team.opponentGoals} (${team.diff})</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">${team.points}</td>
      `;
      tabelleBody.appendChild(row);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Bundesliga Tabelle:", error);
  }
}
