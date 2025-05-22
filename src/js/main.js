import { auth } from "./firebase"; // Importiere Firebase Auth
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";

// FirebaseUI-Konfiguration
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult) {
      console.log("User signed in:", authResult.user);
      return true;
    },
    uiShown: function () {
      document.getElementById("loader").style.display = "none";
    },
  },
  signInFlow: "popup",
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "src/html/home.html",
};

// FirebaseUI-Widget initialisieren
const ui = new firebaseui.auth.AuthUI(auth);
ui.start("#firebaseui-auth-container", uiConfig);
