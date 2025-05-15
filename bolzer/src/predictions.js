const matchdaySelect = document.getElementById("matchday-select");
const resultsList = document.getElementById("results-list");
const bundesligaTableBody = document.getElementById(
    "bundesliga-table-body"
);
const predictionsList = document.getElementById("predictions-list");
const predictionsTitle = document.getElementById("predictions-title");
const resultsTitle = document.getElementById("results-title");
const submitBtn = document.getElementById("submitBtn");
const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");
const leaderboardLink = document.getElementById("leaderboard-link");

openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    mainContent.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    mainContent.classList.remove("active");
});

leaderboardLink.addEventListener("click", (event) => {
    event.preventDefault();
    // Here should be the logic for page navigation to the leaderboard
    alert("Navigate to Leaderboard page");
});

// Bundesliga ID for TheSportsDB is 4331
const leagueId = 4331;
let currentMatchday = 1; // Default value
const season = "2024-2025"; // The current season

/**
 * Determines the number of completed matchdays and the next upcoming matchday.
 * @returns {Promise<{completedMatchdays: number[], nextMatchday: number | null}>}
 */
async function getMatchdays() {
    const totalMatchdays = 34;
    const completedMatchdays = [];
    let nextMatchday = null;
    const today = new Date();

    for (let matchday = 1; matchday <= totalMatchdays; matchday++) {
        const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4331&r=${matchday}&s=2024-2025`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network error: Could not retrieve matchdays.");
            }

            const data = await response.json();
            if (!data.events) {
                continue; // No games on this matchday
            }

            for (const game of data.events) {
                const gameDate = new Date(game.dateEvent);
                const round = parseInt(game.intRound);

                if (!isNaN(round)) {
                    if (gameDate < today) {
                        completedMatchdays.push(round);
                        break; // Only the first past game is sufficient
                    } else if (gameDate > today) {
                        nextMatchday = round;
                        break;
                    }
                }
            }

            // If the next matchday has been found, break the loop
            if (nextMatchday !== null) {
                break;
            }

        } catch (error) {
            console.error("Error fetching matchdays:", error);
            alert("Error fetching matchdays. Please try again later.");
            return {completedMatchdays: [], nextMatchday: null};
        }
    }

    // Remove duplicates and sort
    const uniqueCompletedMatchdays = [...new Set(completedMatchdays)].sort((a, b) => a - b);

    return {
        completedMatchdays: uniqueCompletedMatchdays,
        nextMatchday: nextMatchday
    };
}


// Function to create the dropdown options for the matchdays
async function populateMatchdayDropdown() {
    const {completedMatchdays, nextMatchday} = await getMatchdays();
    const selectElement = document.getElementById("matchday-select");

    // Remove previous options
    selectElement.innerHTML = "";

    // Add completed matchdays
    completedMatchdays.forEach(matchday => {
        const option = document.createElement("option");
        option.value = matchday;
        option.textContent = `Spieltag ${matchday}`;
        selectElement.appendChild(option);
    });

    // Add the next matchday (if it exists and is not already included)
    if (nextMatchday && !completedMatchdays.includes(nextMatchday)) {
        const option = document.createElement("option");
        option.value = nextMatchday;
        option.textContent = `Spieltag ${nextMatchday} (Nächster)`;
        selectElement.appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateMatchdayDropdown();
});

matchdaySelect.addEventListener("change", () => {
    currentMatchday = parseInt(matchdaySelect.value);
    predictionsTitle.textContent = `Submit Predictions: Matchday ${currentMatchday}`;
    resultsTitle.textContent = `Results: Matchday ${currentMatchday}`;
    resultsList.innerHTML =
        '<li class="text-gray-500 italic">Loading results...</li>';
    predictionsList.innerHTML = ""; //clear
    getMatchdayData(currentMatchday);
});

function getMatchdayData(matchday) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=${leagueId}&r=${matchday}&s=${season}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error: Could not retrieve data.");
            }
            return response.json();
        })
        .then((data) => {
            if (!data.events || !Array.isArray(data.events)) {
                // Check if data.events exists and is an array
                resultsList.innerHTML =
                    '<li class="text-red-500 text-center font-semibold">No games found for this matchday.</li>';
                predictionsList.innerHTML =
                    '<li class="text-red-500 text-center font-semibold">No games found for this matchday.</li>';
                return;
            }

            let resultsHtml = "";
            let predictionsHtml = "";
            data.events.forEach((game) => {
                resultsHtml += `
                          <li class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <span class="font-semibold text-gray-900">${game.strHomeTeam}</span>
                                  <span class="text-gray-600">-</span>
                                  <span class="font-semibold text-gray-900">${game.strAwayTeam}</span>
                              </div>
                                <div class="text-gray-700 text-sm">
                                ${
                    game.intHomeScore !== null &&
                    game.intAwayScore !== null
                        ? `<span class="font-semibold">${game.intHomeScore} : ${game.intAwayScore}</span><br>`
                        : ""
                }
                                  ${game.dateEvent} / ${game.strTime}
                              </div>
                          </li>
                      `;

                predictionsHtml += `
                      <li class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center" data-game-id="${game.idEvent}">
                          <div class="text-center md:text-left font-semibold text-gray-900">${game.strHomeTeam}</div>
                          <div class="flex space-x-2 justify-center">
                              <input type="number" class="homeTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                              <span class="text-gray-500">:</span>
                              <input type="number" class="awayTeamResult w-16 border border-gray-300 rounded-md py-2 text-center" placeholder="Tore" value="">
                          </div>
                          <div class="text-center md:text-right font-semibold text-gray-900">${game.strAwayTeam}</div>
                      </li>
                  `;
            });
            resultsList.innerHTML = resultsHtml;
            predictionsList.innerHTML = predictionsHtml;
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            resultsList.innerHTML = `<li class="text-red-500 text-center">An error occurred: ${error.message}</li>`;
            predictionsList.innerHTML = `<li class="text-red-500 text-center">An error occurred: ${error.message}</li>`;
        });
}

// Function to retrieve and display the Bundesliga table
function getBundesligaTable() {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${leagueId}&s=${season}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error: Could not retrieve table.");
            }
            return response.json();
        })
        .then((data) => {
            if (!data.table) {
                bundesligaTableBody.innerHTML =
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
            bundesligaTableBody.innerHTML = tableHtml;
        })
        .catch((error) => {
            console.error("Error fetching table:", error);
            bundesligaTableBody.innerHTML = `<tr><td colspan="4" class="text-red-500 text-center py-4">An error occurred: ${error.message}</td></tr>`;
        });
}

// Fetch the table when the page loads
getBundesligaTable();
// Populate the dropdown
populateMatchdayDropdown();
// Initial call
getMatchdayData(currentMatchday);
