import { auth, db } from "./firebase.js";
import { ref, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const spieltagSelect = document.getElementById("spieltag-select");
const ergebnisListe = document.getElementById("ergebnis-liste");
const bundesligaTabelleBody = document.getElementById(
  "bundesliga-tabelle-body"
);
const tippabgabeListe = document.getElementById("tippabgabe-liste");
const tippabgabeTitle = document.getElementById("tippabgabe-title");
const submitBtn = document.getElementById("submitBtn");
const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");
const navContent = document.getElementById("nav-content");
const ligaId = 4331
let naechsterSpieltagGlobal = null;

openSidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  mainContent.classList.add("active");
  navContent.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
  mainContent.classList.remove("active");
  navContent.classList.remove("active");
});

//Lade Spieltage aus der Firebase Realtime Database
async function getSpieltageFromDB() {
  const spieltagRef = ref(db, "spieltage");
  const snapshot = await get(spieltagRef);

  if (!snapshot.exists()) {
    console.error("Keine Spieltage gefunden.");
    return [];
  }

  const data = snapshot.val();
  const spieltagKeys = Object.keys(data)
    .map((key) => parseInt(key))
    .sort((a, b) => a - b);

  return spieltagKeys; //returnt die Spieltage (1, 2, 3, 4, usw.)
}

// Befüllt das Dropdown Menü zum auswählen der Spieltage
let aktuellerSpieltag = null

async function populateSpieltagDropdown() {
  const selectElement = document.getElementById("spieltag-select"); //Holt sich das HTML-Element mit der ID spieltag-select
  selectElement.innerHTML = ""; //Leert den Inhalt des Dropdowns, um alte Optionen zu entfernen

  const spieltagKeys = await getSpieltageFromDB();

  spieltagKeys.forEach((spieltag) => {
    const option = document.createElement("option");
    option.value = spieltag;
    option.textContent = `Spieltag ${spieltag}`;
    selectElement.appendChild(option);
  });

  if (spieltagKeys.length > 0) {
    aktuellerSpieltag = spieltagKeys[0];
    selectElement.value = aktuellerSpieltag;
    tippabgabeTitle.textContent = `Tippabgabe Spieltag ${aktuellerSpieltag}`;

    await getSpieltagDataFromDB(aktuellerSpieltag); //Holt die Spieldaten für den aktuellen Spieltag
    updateTippabgabeForm(aktuellerSpieltag); //Aktualisiert das Tippformular
  }  
}
//Wartet bis die HTML seite geladen ist bevor die Funktion populateSpieltagDropdown() ausgeführt wird.
document.addEventListener("DOMContentLoaded", () => {
  populateSpieltagDropdown();
});

// Funktion, um die Ergebnisse Felder mit den Daten aus der Firebase Realtime Database zu befüllen
async function getSpieltagDataFromDB(spieltag) {
  const spieltagRef = ref(db, `spieltage/${spieltag}`);

  try {
    const snapshot = await get(spieltagRef);

    if (!snapshot.exists()) {
      ergebnisListe.innerHTML =
        '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
      tippabgabeListe.innerHTML =
        '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
      return;
    }

    const spiele = Object.values(snapshot.val());

    let ergebnisHtml = "";
    let tippabgabeHtml = "";

    spiele.forEach((spiel) => {
      const datum = new Date(spiel.matchDateTime).toLocaleString("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      ergebnisHtml += `
        <li class="p-4 flex justify-between items-center">
          <div class="flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span class="font-semibold text-gray-900 dark:text-white">${spiel.homeTeam}</span>
            <span class="text-gray-600 dark:text-white">-</span>
            <span class="font-semibold text-gray-900 dark:text-white">${spiel.awayTeam}</span>
          </div>
          <div class="text-gray-700 text-sm dark:text-white">
            ${
              spiel.homeTeamScore !== null && spiel.awayTeamScore !== null
                ? `<span class="font-semibold">${spiel.homeTeamScore} : ${spiel.awayTeamScore}</span><br>`
                : ""
            }
            ${datum}
          </div>
        </li>
      `;

      tippabgabeHtml += `
        <li class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center" data-game-id="${spiel.matchID}">
          <div class="text-center md:text-left font-semibold text-gray-900 dark:text-white">${spiel.homeTeam}</div>
          <div class="flex space-x-2 justify-center">
            <input type="number" class="homeTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore">
            <span class="text-gray-500">:</span>
            <input type="number" class="awayTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore">
          </div>
          <div class="text-center md:text-right font-semibold text-gray-900 dark:text-white">${spiel.awayTeam}</div>
        </li>
      `;
    });

    ergebnisListe.innerHTML = ergebnisHtml;
    tippabgabeListe.innerHTML = tippabgabeHtml;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    ergebnisListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;
    tippabgabeListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;
  }
}

// Funktion, um die Bundesliga-Tabelle abzurufen und anzuzeigen
async function getBundesligaTableFromDB() {
  const tableRef = ref(db, 'tabelle');

  try {
    const snapshot = await get(tableRef);

    if (!snapshot.exists()) {
      bundesligaTabelleBody.innerHTML = '<tr><td colspan="4" class="text-gray-500 text-center py-4">Keine Tabellendaten gefunden.</td></tr>';
      return;
    }

    const teamsData = snapshot.val();

    let tableHtml = '';
    Object.keys(teamsData).sort((a, b) => a - b).forEach(rank => {
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
    console.error('Fehler beim Laden der Tabelle:', error);
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
      const predictionsRef = ref(db, `predictions/${spieltag}/${userId}`);

      try {
        const snapshot = await get(predictionsRef);
        if (snapshot.exists()) {
          resolve(snapshot.val());
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

function disablePredictionInputs() {
  const predictionInputs = document.querySelectorAll(
    "#tippabgabe-liste input[type='number']"
  );
  predictionInputs.forEach((input) => {
    input.disabled = true;
  });
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

function enablePredictionInputs() {
  const predictionInputs = document.querySelectorAll(
    "#tippabgabe-liste input[type='number']"
  );
  predictionInputs.forEach((input) => {
    input.disabled = false;
  });
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

async function updateTippabgabeForm(spieltag) {
  const userPredictions = await loadUserPredictions(spieltag);
  const predictionItems = document.querySelectorAll("#tippabgabe-liste li");

  predictionItems.forEach((item) => {
    const gameId = item.getAttribute("data-game-id");
    const prediction = userPredictions?.[gameId];

    const homeScoreInput = item.querySelector(".homeTeamResult");
    const awayScoreInput = item.querySelector(".awayTeamResult");

    if (homeScoreInput) {
      homeScoreInput.value = prediction?.homeScore || "";
    }
    if (awayScoreInput) {
      awayScoreInput.value = prediction?.awayScore || "";
    }
  });

  // Überprüfen, ob der ausgewählte Spieltag älter als der nächste ist
  if (naechsterSpieltagGlobal !== null && spieltag < naechsterSpieltagGlobal) {
    disablePredictionInputs();
  } else {
    enablePredictionInputs();
  }
}

spieltagSelect.addEventListener("change", () => {
  aktuellerSpieltag = parseInt(spieltagSelect.value);
  tippabgabeTitle.textContent = `Tippabgabe [Spieltag ${aktuellerSpieltag}]`;
  ergebnisListe.innerHTML =
    '<li class="text-gray-500 italic dark:text-white">Lade Ergebnisse...</li>';
  tippabgabeListe.innerHTML = ""; // Clear existing list
  getSpieltagDataFromDB(aktuellerSpieltag).then(() => {
    updateTippabgabeForm(aktuellerSpieltag); // Nach dem Laden der Spiele die Tipps laden und Eingabefelder aktivieren/deaktivieren
  });
});

document
  .getElementById("submitBtn")
  .addEventListener("click", writePredictionsToDB);

function writePredictionsToDB() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Bitte melde dich an!");
      return;
    }
    const userId = user.uid;
    const predictions = [];
    const predictionItems = document.querySelectorAll("#tippabgabe-liste li");

    predictionItems.forEach((item) => {
      const gameId = item.getAttribute("data-game-id");
      const homeTeam =
        document.getElementById(`homeTeam-${gameId}`)?.textContent || "";
      const awayTeam =
        document.getElementById(`awayTeam-${gameId}`)?.textContent || "";

      const homeScore = item.querySelector(".homeTeamResult").value;
      const awayScore = item.querySelector(".awayTeamResult").value;

      if (homeScore !== "" && awayScore !== "") {
        predictions.push({
          gameId,
          homeTeam,
          awayTeam,
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
        });
      }
    });

    if (predictions.length === 0) {
      alert("Bitte gib mindestens einen Tipp ab.");
      return;
    }

    // Optional: Spieltag aus Select holen
    const spieltag = document.getElementById("spieltag-select").value;

    const predictionsObj = {};
    predictions.forEach((prediction) => {
      predictionsObj[prediction.gameId] = prediction;
    });

    // Schreibe alle Tipps unter /predictions/{userId}/{spieltag}/
    const userPredictionsRef = ref(db, `predictions/${spieltag}/${userId}`);
    set(userPredictionsRef, predictionsObj)
      .then(() => {
        alert("Tipps erfolgreich gespeichert!");
      })
      .catch((error) => {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern der Tipps.");
      });
  });
}

getBundesligaTableFromDB();
getSpieltagDataFromDB(aktuellerSpieltag).then(() => {
  // Initial die Tipps für den ersten geladenen Spieltag laden
  const initialSpieltag = spieltagSelect.value;
  if (initialSpieltag) {
    updateTippabgabeForm(initialSpieltag);
  }

  // Switch Dark Mode
  const toggleButton = document.getElementById("darkModeToggle")
  const htmlElement = document.documentElement;

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add("dark")
  }else{
    htmlElement.classList.remove("dark")
  }

  toggleButton.addEventListener("click", () => {
    if(htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark")
      localStorage.theme = 'dark';
    }else{
      htmlElement.classList.add("dark")
      localStorage.theme = 'dark';
    }
  })
});
