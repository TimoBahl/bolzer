// import { auth } from "./firebase.js";

// document.getElementById("submitbtn").addEventListener("click", () => {
//     const homeTeamName = document.getElementById("homeTeamName").textContent;
//     const homeTeamResult = document.getElementById("homeTeamResult").value;

//     const awayTeamName = document.getElementById("awayTeamName").textContent;
//     const awayTeamResult = document.getElementById("awayTeamResult").value;
//     const currentUser = auth.currentUser;
//     if (currentUser) {
//         const uid = currentUser.uid;

//         console.log(homeTeamName)
//         console.log(homeTeamResult)
//         console.log(awayTeamName)
//         console.log(awayTeamResult)
//         console.log(uid)

//     }else{
//         console.log("Kein Benutzer aktuell angemeldet.");
//     }

// })

import { auth, db } from "./firebase.js";
import { ref, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const userId = user.uid;
//     const homeTeam = document.getElementBy
//     const awayTeam = document.getElementById("awayTeamName").textContent;

//     document.getElementById("submitBtn").addEventListener("click", () => {
//       const homeGoals = document.getElementById("homeTeamResult").value;
//       const awayGoals = document.getElementById("awayTeamResult").value;

//       if (homeGoals === "" || awayGoals === "") {
//         alert("Bitte beide Tore eingeben.");
//         return;
//       }

//       const prediction = {
//         userId, // ✅ User-ID anhängen
//         homeTeam,
//         awayTeam,
//         homeGoals: parseInt(homeGoals),
//         awayGoals: parseInt(awayGoals),
//         timestamp: Date.now(),
//       };

//       const predictionsRef = ref(db, "predictions");
//       push(predictionsRef, prediction)
//         .then(() => {
//           alert("Tipp gespeichert!");
//         })
//         .catch((error) => {
//           console.error("Fehler beim Speichern:", error);
//         });
//     });
//   }
// });

const spieltagSelect = document.getElementById('spieltag-select');
const ergebnisListe = document.getElementById('ergebnis-liste');
const bundesligaTabelleBody = document.getElementById('bundesliga-tabelle-body');
const tippabgabeListe = document.getElementById('tippabgabe-liste');
const tippabgabeTitle = document.getElementById('tippabgabe-title');
const resultsTitle = document.getElementById('results-Title');
const submitBtn = document.getElementById('submitBtn');
const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");
const tabelleLink = document.getElementById("tabelle-link");

openSidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  mainContent.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
  mainContent.classList.remove("active");
});

tabelleLink.addEventListener("click", (event) => {
  event.preventDefault();
  // Hier sollte die Logik für den Seitenwechsel zur Tabelle stehen
  alert("Zur Tabelle Seite weiterleiten");
});

// Bundesliga ID für TheSportsDB ist 4331
const ligaId = 4331;
let aktuellerSpieltag = 1; // Standardwert

spieltagSelect.addEventListener('change', () => {
  aktuellerSpieltag = parseInt(spieltagSelect.value);
  tippabgabeTitle.textContent = `Tippabgabe: Spieltag ${aktuellerSpieltag}`;
  resultsTitle.textContent = `Ergebnisse: Spieltag ${aktuellerSpieltag}`;
  ergebnisListe.innerHTML = '<li class="text-gray-500 italic">Lade Ergebnisse...</li>';
  tippabgabeListe.innerHTML = ''; //clear
  getSpieltagData(aktuellerSpieltag);

});

function getSpieltagData(spieltag) {
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=${ligaId}&r=${spieltag}`;

  fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Netzwerkfehler: Konnte Daten nicht abrufen.');
            }
            return response.json();
          })
          .then(data => {
            if (data.events === null) {
              ergebnisListe.innerHTML = '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
              tippabgabeListe.innerHTML = '<li class="text-red-500 text-center font-semibold">Keine Spiele gefunden für diesen Spieltag.</li>';
              return;
            }

            let ergebnisHtml = '';
            let tippabgabeHtml = '';
            data.events.forEach(spiel => {
              ergebnisHtml += `
                          <li class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <span class="font-semibold text-gray-900">${spiel.strHomeTeam}</span>
                                  <span class="text-gray-600">-</span>
                                  <span class="font-semibold text-gray-900">${spiel.strAwayTeam}</span>
                              </div>
                                <div class="text-gray-700 text-sm">
                                ${spiel.intHomeScore !== null && spiel.intAwayScore !== null
                      ? `<span class="font-semibold">${spiel.intHomeScore} : ${spiel.intAwayScore}</span><br>`
                      : ''
              }
                                  ${spiel.dateEvent} / ${spiel.strTime}
                              </div>
                          </li>
                      `;

              tippabgabeHtml += `
                      <li class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center" data-game-id="${spiel.idEvent}">
                          <div class="text-center md:text-left font-semibold text-gray-900">${spiel.strHomeTeam}</div>
                          <div class="flex space-x-2 justify-center">
                              <input type="number" class="homeTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                              <span class="text-gray-500">:</span>
                              <input type="number" class="awayTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                          </div>
                          <div class="text-center md:text-right font-semibold text-gray-900">${spiel.strAwayTeam}</div>
                      </li>
                  `;
            });
            ergebnisListe.innerHTML = ergebnisHtml;
            tippabgabeListe.innerHTML = tippabgabeHtml;
          })
          .catch(error => {
            console.error('Fehler beim Abrufen der Daten:', error);
            ergebnisListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;
            tippabgabeListe.innerHTML = `<li class="text-red-500 text-center">Ein Fehler ist aufgetreten: ${error.message}</li>`;

          });
}


// Funktion, um die Bundesliga-Tabelle abzurufen und anzuzeigen
function getBundesligaTable() {
  const url = `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4331&s=2024-2025`;

  fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Netzwerkfehler: Konnte Tabelle nicht abrufen.');
            }
            return response.json();
          })
          .then(data => {
            if (!data.table) {
              bundesligaTabelleBody.innerHTML = '<tr><td colspan="4" class="text-gray-500 text-center py-4">Tabelle konnte nicht geladen werden.</td></tr>';
              return;
            }

            let tabellenHtml = '';
            data.table.forEach(team => {
              tabellenHtml += `
                          <tr>
                              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${team.intRank}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${team.strTeam}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900">${team.intGoalsFor} : ${team.intGoalsAgainst}</div></td>
                              <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm text-gray-900">${team.intPoints}</div></td>
                          </tr>
                      `;
            });
            bundesligaTabelleBody.innerHTML = tabellenHtml;
          })
          .catch(error => {
            console.error('Fehler beim Abrufen der Tabelle:', error);
            bundesligaTabelleBody.innerHTML = `<tr><td colspan="4" class="text-red-500 text-center py-4">Ein Fehler ist aufgetreten: ${error.message}</td></tr>`;
          });
}

// Rufe die Tabelle beim Laden der Seite ab
getBundesligaTable();
getSpieltagData(aktuellerSpieltag);

submitBtn.addEventListener('click', () => {
  const tipps = [];
  const tippInputs = tippabgabeListe.querySelectorAll('li');
  tippInputs.forEach(spiel => {
    const spielId = spiel.dataset.gameId;
    const homeTeamResultInput = spiel.querySelector('.homeTeamResult');
    const awayTeamResultInput = spiel.querySelector('.awayTeamResult');
    const homeTeamResult = homeTeamResultInput.value.trim();
    const awayTeamResult = awayTeamResultInput.value.trim();

    if (homeTeamResult === '' || awayTeamResult === '') {
      alert('Bitte gib für jedes Spiel einen Tipp ab.');
      return; // Verhindert das Speichern unvollständiger Tipps
    }

    tipps.push({
      spielId: spielId,
      homeTeamResult: parseInt(homeTeamResult),
      awayTeamResult: parseInt(awayTeamResult),
    });
  });

  // Hier erfolgt die Speicherung der Tipps (z.B. per fetch an den Server)
  console.log('Tipps:', tipps);
  alert('Tipps wurden gespeichert!');
  // Optional: Hier könnte eine Weiterleitung oder Aktualisierung der Seite erfolgen
});
