import { auth } from "./firebase"; // Importiere Firebase Auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Zeige das Modal beim Klicken auf den Registrieren-Button
document.getElementById("registerBtn").addEventListener("click", () => {
  document.getElementById("registerModal").classList.remove("hidden");
});

// Schließe das Register-Modal
document.getElementById("closeRegisterModal").addEventListener("click", () => {
  document.getElementById("registerModal").classList.add("hidden");
});

// Registriere den User mit E-Mail und Passwort
document
  .getElementById("submitRegister")
  .addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

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
document.getElementById("closeLoginModal").addEventListener("click", () => {
  document.getElementById("loginModal").classList.add("hidden");
});

// Login des Users mit E-Mail und Passwort
document.getElementById("submitLogin").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login erfolgreich!");
    window.location.href = "/home.html"; // Zielseite für eingeloggte Nutzer
    document.getElementById("loginModal").classList.add("hidden");
  } catch (err) {
    alert("Fehler beim Login: " + err.message);
  }
});
