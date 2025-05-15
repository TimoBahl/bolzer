// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCBZLeKxaqdrbLLSYkTItKa_C-2-vj6B-Y",
  authDomain: "bolzer-8d71d.firebaseapp.com",
  projectId: "bolzer-8d71d",
  storageBucket: "bolzer-8d71d.firebasestorage.app",
  messagingSenderId: "717675127754",
  appId: "1:717675127754:web:5d09697a58e2cbc2a5a533",
  databaseURL: "https://bolzer-8d71d-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth };
export { db };
