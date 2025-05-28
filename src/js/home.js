import {onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from "./firebase";
import { loadUserPointsFromDB } from "./leaderboard/fillTable.js";
import { sideBar } from "./components/sideBar.js";
import { navBar } from "./components/navBar.js";



document.addEventListener('DOMContentLoaded', () => {
    //Add the Leaderboard
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserPointsFromDB();
        } else {
            window.location.href = "./../../../index.html";
        }
    });

    //Add the navBar and sideBar
    sideBar();
    navBar();
})
