// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBZLeKxaqdrbLLSYkTItKa_C-2-vj6B-Y",
  authDomain: "bolzer-8d71d.firebaseapp.com",
  projectId: "bolzer-8d71d",
  storageBucket: "bolzer-8d71d.firebasestorage.app",
  messagingSenderId: "717675127754",
  appId: "1:717675127754:web:5d09697a58e2cbc2a5a533"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
