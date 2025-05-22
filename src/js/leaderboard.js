const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("open-sidebar-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mainContent = document.getElementById("main-content");
const tabelleLink = document.getElementById("tabelle-link");

openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    mainContent.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    mainContent.classList.remove("active");
});
