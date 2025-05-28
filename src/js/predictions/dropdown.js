import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export async function populateSpieltagDropdown() {
  const select = document.getElementById("spieltag-select");

  try {
    const spieltagCol = collection(db, "spieltage");
    const snapshot = await getDocs(spieltagCol);

    const spieltagNummern = snapshot.docs.map((doc) => doc.id).sort((a, b) => a - b);

    select.innerHTML = '<option value=""></option>';

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

document.addEventListener('DOMContentLoaded', async () => {
  const spieltagButton = document.getElementById('spieltag-button');
  const spieltagSelect = document.getElementById('spieltag-select');
  const selectedSpieltagSpan = document.getElementById('selected-spieltag');
  const customSelectContainer = document.getElementById('custom-select-container');

  // Function to position the select field
  const positionSelect = () => {
    const buttonRect = spieltagButton.getBoundingClientRect();

    spieltagSelect.style.position = 'absolute';
    spieltagSelect.style.top = `${buttonRect.height}px`; //Position directly under the bottom
    // Wichtig: Für Rechtsausrichtung muss die Breite des Buttons minus die Breite des Selects genommen werden
    spieltagSelect.style.left = `${buttonRect.width - spieltagSelect.offsetWidth}px`;
    spieltagSelect.style.width = `${buttonRect.width}px`;
    customSelectContainer.style.position = 'relative';
    spieltagSelect.style.zIndex = '1000';

    console.log('positionSelect called. Button width:', buttonRect.width, 'Select width:', spieltagSelect.offsetWidth);
  };

  // 1. Zuerst die Optionen laden
  await populateSpieltagDropdown(); // Warten, bis die Optionen geladen sind

  // 2. Jetzt, da die Optionen im DOM sind, können wir die initiale Position einmal korrekt setzen
  setTimeout(() => {
    positionSelect();
    spieltagSelect.classList.add('hidden');
  }, 0);

  // Event Listener für den Button
  spieltagButton.addEventListener('click', () => {
    spieltagSelect.classList.toggle('hidden');
    if (!spieltagSelect.classList.contains('hidden')) {
      positionSelect();
    }
  });

  // Update button text when a selection is made
  spieltagSelect.addEventListener('change', () => {
    const selectedOption = spieltagSelect.options[spieltagSelect.selectedIndex];
    selectedSpieltagSpan.textContent = selectedOption.textContent;
    spieltagSelect.classList.add('hidden');
  });

  // Close the select field if clicked outside
  document.addEventListener('click', (event) => {
    if (!customSelectContainer.contains(event.target) && !spieltagSelect.classList.contains('hidden')) {
      spieltagSelect.classList.add('hidden');
    }
  });

  // Optional: Event Listener für Fenstergrößenänderungen, falls sich die Breite dynamisch ändert
  window.addEventListener('resize', () => {
    if (!spieltagSelect.classList.contains('hidden')) {
      positionSelect();
    }
  });
});