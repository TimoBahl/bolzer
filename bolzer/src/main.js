import { auth } from "./firebase"; // Importiere Firebase Auth
import { createUserWithEmailAndPassword } from "firebase/auth";

// Zeige das Modal beim Klicken auf den Registrieren-Button
document.getElementById("registerBtn").addEventListener("click", () => {
    document.getElementById("registerModal").classList.remove("hidden");
});

// Schließe das Modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("registerModal").classList.add("hidden");
});

// Registriere den User mit E-Mail und Passwort
document.getElementById("submitRegister").addEventListener("click", async () => {
    const email = document.getElementById("modalEmail").value;
    const password = document.getElementById("modalPassword").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registrierung erfolgreich!");
        window.location.href = "./home.html";
        document.getElementById("registerModal").classList.add("hidden");
    } catch (err) {
        alert("Fehler: " + err.message);
    }
});


// Zeige das Modal beim Klicken auf den Login-Button
document.getElementById("loginBtn").addEventListener("click", () => {
    document.getElementById("loginModal").classList.remove("hidden");
});

// Schließe das Modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("loginModal").classList.add("hidden");
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("modalEmail").value;
  const password = document.getElementById("modalPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login erfolgreich!");
    window.location.href = "/home.html"; // Zielseite für eingeloggte Nutzer
  } catch (err) {
    alert("Fehler beim Login: " + err.message);
  }
});