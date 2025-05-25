import { auth } from "../firebase";
import { populateSpieltagDropdown } from "./dropdown";
import { loadDataForGameday } from "./gameday";
import { savePredictionsToDB } from "./savePredictions";
import { loadResultsFromDB } from "./results";
import { loadBundesligaScoreboardFromDB } from "./bundesligaScoreboard";

//Sidebar
const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");
const navContent = document.getElementById("nav-content");

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

// Dark Mode
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
});
