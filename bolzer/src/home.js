import { signOut } from "firebase/auth";
import { auth } from "./firebase";

document.getElementById("leaderboardBtn").addEventListener("click", () => {
  window.location.href = "./leaderboard.html";
});

document.getElementById("predictionBtn").addEventListener("click", () => {
  window.location.href = "./prediction.html";
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./../index.html";
  } catch (err) {
    alert("Fehler beim Logout: " + err.message);
  }
});
