import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Buttons & Inputs holen
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDisplay = document.getElementById("error");
const googleBtn = document.getElementById("googleLoginBtn");

// Login
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Angemeldet als:", userCredential.user);
    window.location.href = "src/html/home.html";
  } catch (error) {
    errorDisplay.textContent = "Login fehlgeschlagen: " + error.message;
  }
});

// Registrierung
registerBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Registriert als:", userCredential.user);
    window.location.href = "src/html/home.html";
  } catch (error) {
    errorDisplay.textContent = "Registrierung fehlgeschlagen: " + error.message;
  }
});

// Google
googleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google Login:", result.user);
    window.location.href = "src/html/home.html";
  } catch (error) {
    errorDisplay.textContent = "Google Login fehlgeschlagen: " + error.message;
  }
});