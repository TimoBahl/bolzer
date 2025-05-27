import { auth } from "../firebase";
import { populateSpieltagDropdown } from "./dropdown";
import { loadDataForGameday } from "./gameday";
import { savePredictionsToDB } from "./savePredictions";
import { loadResultsFromDB } from "./results";
import { loadBundesligaScoreboardFromDB } from "./bundesligaScoreboard";
import {signOut} from "firebase/auth";

/*
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
 */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./../html/index.html";
  } catch (err) {
    alert("Fehler beim Logout: " + err.message);
  }
});

// Sidebar toggle functionality for small screens
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menu-button');

menuButton.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
});

// Dropdown functionality for user avatar
const dropdownUserAvatarButton = document.getElementById('dropdownUserAvatarButton');
const dropdownAvatar = document.getElementById('dropdownAvatar');

dropdownUserAvatarButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevents the click from immediately propagating to the document listener
  dropdownAvatar.classList.toggle('hidden');
});

// Close dropdown AND sidebar when clicking outside
document.addEventListener('click', (event) => {
  // Close avatar dropdown if open and click is outside
  if (!dropdownUserAvatarButton.contains(event.target) && !dropdownAvatar.contains(event.target)) {
    dropdownAvatar.classList.add('hidden');
  }

  if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
      sidebar.classList.add('-translate-x-full');
    }
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
