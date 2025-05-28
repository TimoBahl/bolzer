import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function loadUserPointsFromDB() {
  const tabelleBody = document.getElementById("tabelle-body");
  tabelleBody.innerHTML = "";

  const usersRef = collection(db, "users")

  try {
    const usersSnapshot = await getDocs(usersRef);
    const leaderboard = [];

    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id;
      const userData = userDoc.data();

      const tippRef = collection(db, `users/${uid}/tipps`);
      const tippsSnapshot = await getDocs(tippRef);

      let totalPoints = 0
      tippsSnapshot.forEach((tippDoc) => {
        const tippData = tippDoc.data();
        totalPoints += tippData.points || 0;
      });

      leaderboard.push({
        name: userData.displayName || "Unbekannter Nutzer",
        points: totalPoints,
      });
    }

    leaderboard.sort((a, b) => b.points - a.points);

    leaderboard.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${index + 1}</td>  
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center gap-6">${user.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">${user.matchdayPoints || 0}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">${user.points}</td>
      `;
      tabelleBody.appendChild(row);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Punkte:", error);
    tabelleBody.innerHTML = `<tr><td colspan="3">Fehler beim Laden</td></tr>`;
  }
}