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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    const homeTeam = document.getElementById("homeTeamName").textContent;
    const awayTeam = document.getElementById("awayTeamName").textContent;

    document.getElementById("submitBtn").addEventListener("click", () => {
      const homeGoals = document.getElementById("homeTeamResult").value;
      const awayGoals = document.getElementById("awayTeamResult").value;

      if (homeGoals === "" || awayGoals === "") {
        alert("Bitte beide Tore eingeben.");
        return;
      }

      const prediction = {
        userId, // ✅ User-ID anhängen
        homeTeam,
        awayTeam,
        homeGoals: parseInt(homeGoals),
        awayGoals: parseInt(awayGoals),
        timestamp: Date.now(),
      };

      const predictionsRef = ref(db, "predictions");
      push(predictionsRef, prediction)
        .then(() => {
          alert("Tipp gespeichert!");
        })
        .catch((error) => {
          console.error("Fehler beim Speichern:", error);
        });
    });
  }
});
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



