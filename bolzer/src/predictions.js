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

async function fetchMatches() {
  const res = await fetch('http://localhost:3000/api/matches');
  const data = await res.json();
  console.log('Matches from proxy:', data); // Was kommt genau zurück?
  return data;
}

async function renderPredictionForm() {
  const matches = await fetchMatches();
  const form = document.getElementById("predictionForm");
  const spieltagTitle = document.getElementById("spieltagTitle");

  if (matches.length > 0) {
    const matchDay = matches[0].Group.GroupName;
    spieltagTitle.textContent = matchDay;
  }

  matches.forEach((match) => {
    const homeTeam = match.Team1.TeamName;
    const awayTeam = match.Team2.TeamName;
    const matchId = match.MatchID;

    const matchBlock = document.createElement("div");
    matchBlock.className = "grid grid-cols-1 md:grid-cols-3 gap-4 items-center";

    matchBlock.innerHTML = `
      <div name="${homeTeam}-${matchId}"class="text-center md:text-left font-semibold text-gray-900">
        ${homeTeam}
      </div>
      <div class="flex space-x-2 justify-center">
        <input
          name="home-${matchId}"
          type="number"
          class="w-16 border border-gray-300 rounded-md py-2 text-center"
          placeholder="Tore"
        />
        <span class="text-gray-500">:</span>
        <input
          name="away-${matchId}"
          type="number"
          class="w-16 border border-gray-300 rounded-md py-2 text-center"
          placeholder="Tore"
        />
      </div>
      <div name="${awayTeam}-${matchId}" class="text-center md:text-right font-semibold text-gray-900">
        ${awayTeam}
      </div>
    `;

    form.appendChild(matchBlock);
  });
}

function setupPredictionSave() {
  const button = document.getElementById("submitBtn");

  button.addEventListener("click", () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Bitte melde dich zuerst an.");
        return;
      }

      const userId = user.uid;
      const form = document.getElementById("predictionForm");
      const inputs = form.querySelectorAll("input");

      const predictions = [];

      for (let i = 0; i < inputs.length; i += 2) {
        const homeInput = inputs[i];
        const awayInput = inputs[i + 1];
        const matchId = homeInput.name.split("-")[1];

        const matchDiv = homeInput.closest(".grid");
        const homeTeam = matchDiv.querySelector("[data-home-team]").textContent.trim();
        const awayTeam = matchDiv.querySelector("[data-away-team]").textContent.trim();

        const homeGoals = homeInput.value;
        const awayGoals = awayInput.value;

        if (homeGoals === "" || awayGoals === "") continue;

        predictions.push({
          matchId,
          userId,
          homeTeam,
          awayTeam,
          homeGoals: parseInt(homeGoals),
          awayGoals: parseInt(awayGoals),
          timestamp: Date.now(),
        });
      }

      const predictionsRef = ref(db, `predictions/${userId}`);
      predictions.forEach((prediction) => {
        push(predictionsRef, prediction);
      });

      alert("Tipps gespeichert!");
    });
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await renderPredictionForm();
  setupPredictionSave();
});

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
