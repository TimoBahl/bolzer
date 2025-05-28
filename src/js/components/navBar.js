
// Dropdown functionality for user avatar
export function navBar(){
    const dropdownUserAvatarButton = document.getElementById('dropdownUserAvatarButton');
    const dropdownAvatar = document.getElementById('dropdownAvatar');

    dropdownUserAvatarButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the click from immediately propagating to the document listener
        dropdownAvatar.classList.toggle('hidden');
    });
}