import {auth, db} from "./firebase.js";
import {ref, set, push} from "firebase/database";
import {onAuthStateChanged} from "firebase/auth";

console.log("Script wurde geladen!");

const spieltagSelect = document.getElementById("spieltag-select");
const ergebnisListe = document.getElementById("ergebnis-liste");
const bundesligaTabelleBody = document.getElementById(
    "bundesliga-tabelle-body"
);
const tippabgabeListe = document.getElementById("tippabgabe-liste");
const tippabgabeTitle = document.getElementById("tippabgabe-title");
const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");


openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    mainContent.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    mainContent.classList.remove("active");
});


// Bundesliga ID für TheSportsDB ist 4331
const ligaId = 4331;
let aktuellerSpieltag = 1; // Standardwert

async function getSpieltage() {
    const matchDays = 34;
    const gespielteSpieltage = [];
    let naechsterSpieltag = null;
    const heute = new Date();

    for (let spieltag = 1; spieltag <= matchDays; spieltag++) {
        const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4331&r=${spieltag}&s=2024-2025`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Netzwerkfehler: Konnte Spieltage nicht abrufen.");
            }
            const data = await response.json();
            if (!data.events) {
                continue;
            }

            for (const spiel of data.events) {
                const spielDatum = new Date(spiel.dateEvent);
                const round = parseInt(spiel.intRound);

                if (!isNaN(round)) {
                    if (spielDatum < heute) {
                        gespielteSpieltage.push(round);
                        break;
                    } else if (spielDatum > heute) {
                        naechsterSpieltag = round;
                        break;
                    }
                }
            }

            if (naechsterSpieltag !== null) {
                break;
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der Spieltage:", error);
            alert("Fehler beim Abrufen der Spieltage. Bitte versuchen Sie es später noch einmal.");
            return {gespielteSpieltage: [], naechsterSpieltag: null};
        }
    }

    const eindeutigeGespielteSpieltage = [...new Set(gespielteSpieltage)].sort((a, b) => a - b);

    return {
        gespielteSpieltage: eindeutigeGespielteSpieltage,
        naechsterSpieltag: naechsterSpieltag
    };
}

// Funktion, um die Dropdown-Optionen für die Spieltage zu erstellen
async function populateSpieltagDropdown() {
    const {gespielteSpieltage, naechsterSpieltag} = await getSpieltage();
    const selectElement = document.getElementById("spieltag-select");

    selectElement.innerHTML = "";

    gespielteSpieltage.forEach(spieltag => {
        const option = document.createElement("option");
        option.value = spieltag;
        option.textContent = `Spieltag ${spieltag}`;
        selectElement.appendChild(option);
    });
// Nächster Spieltag hinzufügen (falls vorhanden und noch nicht enthalten)
    if (naechsterSpieltag && !gespielteSpieltage.includes(naechsterSpieltag)) {
        const option = document.createElement("option");
        option.value = naechsterSpieltag;
        option.textContent = `Spieltag ${naechsterSpieltag} (nächster)`;
        selectElement.appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateSpieltagDropdown();
});

spieltagSelect.addEventListener("change", () => {
    aktuellerSpieltag = parseInt(spieltagSelect.value);
    tippabgabeTitle.textContent = `Tippabgabe [Spieltag ${aktuellerSpieltag}]`;
    ergebnisListe.innerHTML =
        '<li class="text-gray-500 italic">Lade Ergebnisse...</li>';
    tippabgabeListe.innerHTML = ""; //clear
    getSpieltagData(aktuellerSpieltag);
});


// Fuktion um den Bundesliga Spieltag anzuzeigen
function getSpieltagData(aktuellerSpieltag) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=${ligaId}&r=${aktuellerSpieltag}&s=2024-2025`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Netzwerkfehler: Konnte Daten nicht abrufen.");
            }
            return response.json();
        })
        .then((data) => {
            if (data.events === null) {
                ergebnisListe.innerHTML =
                    '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
                tippabgabeListe.innerHTML =
                    '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
                return;
            }

            let ergebnisHtml = "";
            let tippabgabeHtml = "";
            data.events.forEach((spiel) => {
                ergebnisHtml += `
                          <li class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <span class="font-semibold text-gray-900">${
                    spiel.strHomeTeam
                }</span>
                                  <span class="text-gray-600">-</span>
                                  <span class="font-semibold text-gray-900">${
                    spiel.strAwayTeam
                }</span>
                              </div>
                                <div class="text-gray-700 text-sm">
                                ${
                    spiel.intHomeScore !== null &&
                    spiel.intAwayScore !== null
                        ? `<span class="font-semibold">${spiel.intHomeScore} : ${spiel.intAwayScore}</span><br>`
                        : ""
                }
                                  ${spiel.strDate} ${spiel.strTime}
                              </div>
                          </li>
                      `;

                tippabgabeHtml += `
                      <li class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center" data-game-id="${spiel.idEvent}">
                          <div id="homeTeam-${spiel.idEvent}" class="text-center md:text-left font-semibold text-gray-900">${spiel.strHomeTeam}</div>
                          <div class="flex space-x-2 justify-center">
                              <input type="number" class="homeTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                              <span class="text-gray-500">:</span>
                              <input type="number" class="awayTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                          </div>
                          <div id="awayTeam-${spiel.idEvent}" class="text-center md:text-right font-semibold text-gray-900">${spiel.strAwayTeam}</div>
                      </li>
                  `;
            });
            ergebnisListe.innerHTML = ergebnisHtml;
            tippabgabeListe.innerHTML = tippabgabeHtml;
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen der Daten:", error);
            ergebnisListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;
            tippabgabeListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;
        });
}

// Funktion, um die Bundesliga-Tabelle abzurufen und anzuzeigen
function getBundesligaTable() {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${ligaId}&s=2024-2025`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error: Could not retrieve table.");
            }
            return response.json();
        })
        .then((data) => {
            if (!data.table) {
                bundesligaTabelleBody.innerHTML =
                    '<tr><td colspan="4" class="text-gray-500 text-center py-4">Table could not be loaded.</td></tr>';
                return;
            }

            let tableHtml = "";
            data.table.forEach((team) => {
                tableHtml += `
                          <tr>
                              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${team.intRank}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${team.strTeam}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900">${team.intGoalsFor} : ${team.intGoalsAgainst}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900">${team.intPoints}</div></td>
                          </tr>
                      `;
            });
            bundesligaTabelleBody.innerHTML = tableHtml;
        })
        .catch((error) => {
            console.error("Error fetching table:", error);
            bundesligaTabelleBody.innerHTML = `<tr><td colspan="4" class="text-red-500 text-center py-4">An error occurred: ${error.message}</td></tr>`;
        });
}

// Rufe die Tabelle beim Laden der Seite ab
getBundesligaTable();
getSpieltagData(aktuellerSpieltag);

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
            const homeTeam = document.getElementById(`homeTeam-${gameId}`)?.textContent || "";
            const awayTeam = document.getElementById(`awayTeam-${gameId}`)?.textContent || "";

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
        const userPredictionsRef = ref(db, `predictions/spieltag_${spieltag}/${userId}`);
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