import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function loadResultsFromDB(spieltag) {
  const ergebnisListe = document.getElementById("ergebnis-liste");
  ergebnisListe.innerHTML = "";

  try {
    const spieleRef = collection(
      db,
      "spieltage",
      spieltag.toString(),
      "spiele"
    );
    const querySnapshot = await getDocs(spieleRef);

    if (querySnapshot.empty) {
      ergebnisListe.innerHTML = "<li>Keine Ergebnisse gefunden.</li>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const spiel = doc.data();

      const datum = spiel.datum
        ? new Date(spiel.datum).toLocaleString("de-DE", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unbekanntes Datum";

      const li = document.createElement("li");
      li.classList.add(
        "flex",
        "justify-between",
        "bg-gray-100",
        "dark:bg-gray-700",
        "p-2",
        "rounded"
      );

      li.innerHTML = `
          <div class="flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span class="font-semibold text-gray-900 dark:text-white">${
              spiel.heim
            }</span>
            <span class="text-gray-600 dark:text-white">-</span>
            <span class="font-semibold text-gray-900 dark:text-white">${
              spiel.gast
            }</span>
          </div>
          <div class="text-gray-700 text-sm dark:text-white">
            ${
              spiel.ergebnis
                ? `<span class="font-semibold">${spiel.ergebnis.toreHeim} : ${spiel.ergebnis.toreGast}</span><br>`
                : ""
            }
            ${datum}
          </div>
      `;

      ergebnisListe.appendChild(li);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Ergebnisse:", error);
    ergebnisListe.innerHTML = "<li>Fehler beim Laden der Ergebnisse.</li>";
  }
}
