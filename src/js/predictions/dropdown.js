import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export async function populateSpieltagDropdown() {
  const select = document.getElementById("spieltag-select");

  try {
    const spieltagCol = collection(db, "spieltage");
    const snapshot = await getDocs(spieltagCol);

    const spieltagNummern = snapshot.docs.map((doc) => doc.id).sort((a, b) => a - b);

    spieltagNummern.forEach((spieltag) => {
      const option = document.createElement("option");
      option.value = spieltag;
      option.textContent = `Spieltag ${spieltag}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Spieltage:", error);
  }
}
