// src/main.js
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// Registrierung
document.getElementById("registerBtn").addEventListener("click", async () => {
  console.log("🔥 Registrierung-Klick erkannt!");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registrierung erfolgreich!");
  } catch (err) {
    alert("Fehler: " + err.message);
  }
});

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  console.log("🔥 Login-Klick erkannt!");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login erfolgreich!");
  } catch (err) {
    alert("Fehler: " + err.message);
  }
});

// Auth-Status
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Eingeloggt als:", user.email);
  } else {
    console.log("🚪 Nicht eingeloggt");
  }
});
