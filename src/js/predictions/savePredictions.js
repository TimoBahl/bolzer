import { db, auth } from "../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function savePredictionsToDB() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Bitte melde dich an.");
      return;
    }

    const userId = user.uid;
    const gameday = document.getElementById("spieltag-select")?.value;
    const predictionItems = document.querySelectorAll("#tippabgabe-liste li");
    let savedAny = false;

    for (const item of predictionItems) {
      const gameId = item.getAttribute("data-game-id");
      const homeScoreInput = item.querySelector(".homeTeamResult");
      const awayScoreInput = item.querySelector(".awayTeamResult");

      const toreHeim = parseInt(homeScoreInput.value);
      const toreGast = parseInt(awayScoreInput.value);

      // Überspringe leere Felder
      if (isNaN(toreHeim) || isNaN(toreGast)) continue;

      const homeTeam = document.getElementById(`homeTeam-${gameId}`)?.textContent.trim() || "";
      const awayTeam = document.getElementById(`awayTeam-${gameId}`)?.textContent.trim() || "";


      const tippData = {
        toreHeim,
        toreGast,
        homeTeam,
        awayTeam,
        gameday,
        timestamp: Timestamp.now(),
      };

      const tippDocRef = doc(db, "users", userId, "tipps", gameId);

      try {
        await setDoc(tippDocRef, tippData, { merge: true });
        savedAny = true;
      } catch (error) {
        console.error(`Fehler beim Speichern von Spiel ${gameId}:`, error);
      }
    }

    if (savedAny) {
      alert("Tipps gespeichert!");
    } else {
      alert("Keine Tipps eingegeben.");
    }
  });
}
