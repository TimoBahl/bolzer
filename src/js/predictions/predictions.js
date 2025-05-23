import { populateSpieltagDropdown } from "./dropdown";
import { loadDataForGameday } from "./gameday";
import { savePredictionsToDB } from "./savePredictions";
import { loadResultsFromDB } from "./results";

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

document.addEventListener("DOMContentLoaded", async () => {
  await populateSpieltagDropdown();

  document
    .getElementById("spieltag-select")
    .addEventListener("change", async (e) => {
      const gameday = e.target.value;
      if (gameday) {
        await loadDataForGameday(gameday);
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
