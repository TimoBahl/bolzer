import { auth } from "../firebase";
import { populateSpieltagDropdown } from "./dropdown";
import { loadDataForGameday } from "./gameday";
import { savePredictionsToDB } from "./savePredictions";
import { loadResultsFromDB } from "./results";
import { loadBundesligaScoreboardFromDB } from "./bundesligaScoreboard";

import { sideBar} from "../components/sideBar";
import { navBar} from "../components/navBar";


// Main functions
let currentUser = null;

auth.onAuthStateChanged(async (user) => {
  currentUser = user;

  const spieltagSelect = document.getElementById("spieltag-select");
  if (spieltagSelect.value) {
    await loadDataForGameday(spieltagSelect.value, currentUser);
    loadResultsFromDB(spieltagSelect.value)
  }
})

document.addEventListener("DOMContentLoaded", async () => {
  await populateSpieltagDropdown();
  loadBundesligaScoreboardFromDB();

  document
    .getElementById("spieltag-select")
    .addEventListener("change", async (e) => {
      const gameday = e.target.value;
      if (gameday) {
        await loadDataForGameday(gameday, currentUser);
        loadResultsFromDB(gameday);
      }
    });

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      savePredictionsToDB();
    });
  }

  //Integrate the sideBar and navBar functionality
  sideBar();
  navBar();
});
