import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { loadUserPointsFromDB } from "./fillTable.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./../html/index.html";
  } catch (err) {
    alert("Fehler beim Logout: " + err.message);
  }
});



// Main Functions
window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserPointsFromDB();
    } else {
      window.location.href = "./../../../index.html";
    }
  });
});
