import { auth, db } from "./firebase.js";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const spieltagSelect = document.getElementById("spieltag-select");
const ergebnisListe = document.getElementById("ergebnis-liste");
const bundesligaTabelleBody = document.getElementById(
  "bundesliga-tabelle-body"
);
const tippabgabeListe = document.getElementById("tippabgabe-liste");
const tippabgabeTitle = document.getElementById("tippabgabe-title");
const submitBtn = document.getElementById("submitBtn");
let naechsterSpieltagGlobal = null;

// Funktion, um die Bundesliga-Tabelle abzurufen und anzuzeigen
async function getBundesligaTableFromDB() {
  const tableRef = ref(db, "tabelle");

  try {
    const snapshot = await get(tableRef);

    if (!snapshot.exists()) {
      bundesligaTabelleBody.innerHTML =
        '<tr><td colspan="4" class="text-gray-500 text-center py-4">Keine Tabellendaten gefunden.</td></tr>';
      return;
    }

    const teamsData = snapshot.val();

    let tableHtml = "";
    Object.keys(teamsData)
      .sort((a, b) => a - b)
      .forEach((rank) => {
        const team = teamsData[rank];
        tableHtml += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900 dark:text-white">${rank}</div></td>
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900 dark:text-white">${team.teamName}</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900 dark:text-white">${team.teamGoals} : ${team.opponentGoals}</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900 dark:text-white">${team.points}</div></td>
        </tr>
      `;
      });

    bundesligaTabelleBody.innerHTML = tableHtml;
  } catch (error) {
    console.error("Fehler beim Laden der Tabelle:", error);
    bundesligaTabelleBody.innerHTML = `<tr><td colspan="4" class="text-red-500 text-center py-4">Fehler: ${error.message}</td></tr>`;
  }
}

async function loadUserPredictions(spieltag) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Benutzer ist nicht angemeldet.");
        resolve({});
        return;
      }
      const userId = user.uid;
      const docRef = doc(db, "predictions", spieltag.toString(), userId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          resolve(docSnap.data());
        } else {
          resolve({});
        }
      } catch (error) {
        console.error("Fehler beim Laden der Vorhersagen:", error);
        reject(error);
      }
    });
  });
}


document
  .getElementById("submitBtn")
  .addEventListener("click", writePredictionsToDB);

function writePredictionsToDB() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Bitte melde dich an!");
      return;
    }

    const userId = user.uid;
    const predictionItems = document.querySelectorAll("#tippabgabe-liste li");
    let savedCount = 0;

    for (const item of predictionItems) {
      const gameId = item.getAttribute("data-game-id");
      const homeTeam =
        document.getElementById(`homeTeam-${gameId}`)?.textContent || "";
      const awayTeam =
        document.getElementById(`awayTeam-${gameId}`)?.textContent || "";

      const homeScore = item.querySelector(".homeTeamResult")?.value;
      const awayScore = item.querySelector(".awayTeamResult")?.value;

      if (homeScore !== "" && awayScore !== "") {
        const parsedHome = parseInt(homeScore, 10);
        const parsedAway = parseInt(awayScore, 10);

        if (isNaN(parsedHome) || isNaN(parsedAway)) {
          console.warn(`Ungültige Eingabe bei Spiel ${gameId}`);
          continue;
        }

        const predictionRef = doc(db, "users", userId, "tipps", gameId);
        const tippData = {
          homeTeam,
          awayTeam,
          toreHeim: parsedHome,
          toreGast: parsedAway,
          timestamp: Date.now(),
        };

        try {
          await setDoc(predictionRef, tippData, { merge: true });
          savedCount++;
        } catch (error) {
          console.error(`Fehler beim Speichern von Spiel ${gameId}:`, error);
        }
      }
    }

    if (savedCount > 0) {
      alert(`${savedCount} Tipp(s) erfolgreich gespeichert.`);
    } else {
      alert("Keine gültigen Tipps zum Speichern gefunden.");
    }
  });
}

  // Switch Dark Mode
  const toggleButton = document.getElementById("darkModeToggle");
  const htmlElement = document.documentElement;

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }

  toggleButton.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.theme = "dark";
    } else {
      htmlElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  });
