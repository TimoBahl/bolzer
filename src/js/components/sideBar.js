
export function sideBar(){
    // Sidebar toggle functionality for small screens
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menu-button");

    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
    });

// Close dropdown AND sidebar when clicking outside
    document.addEventListener("click", (event) => {
        // Close avatar dropdown if open and click is outside
        if (
            !dropdownUserAvatarButton.contains(event.target) &&
            !dropdownAvatar.contains(event.target)
        ) {
            dropdownAvatar.classList.add("hidden");
        }

        if (
            !sidebar.classList.contains("-translate-x-full") &&
            window.innerWidth < 768
        ) {
            if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
                sidebar.classList.add("-translate-x-full");
            }
        }
    });
}

