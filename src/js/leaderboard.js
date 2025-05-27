import {signOut} from "firebase/auth";
import {auth} from "./firebase.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "./../html/index.html";
    } catch (err) {
        alert("Fehler beim Logout: " + err.message);
    }
});

// Sidebar toggle functionality for small screens
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menu-button');

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
});

// Dropdown functionality for user avatar
const dropdownUserAvatarButton = document.getElementById('dropdownUserAvatarButton');
const dropdownAvatar = document.getElementById('dropdownAvatar');

dropdownUserAvatarButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents the click from immediately propagating to the document listener
    dropdownAvatar.classList.toggle('hidden');
});

// Close dropdown AND sidebar when clicking outside
document.addEventListener('click', (event) => {
    // Close avatar dropdown if open and click is outside
    if (!dropdownUserAvatarButton.contains(event.target) && !dropdownAvatar.contains(event.target)) {
        dropdownAvatar.classList.add('hidden');
    }

    if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.add('-translate-x-full');
        }
    }
});
