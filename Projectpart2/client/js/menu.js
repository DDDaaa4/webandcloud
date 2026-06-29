function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function logoutUser() {
    clearSession();
    window.location.href = 'login.html';
}

document.addEventListener('click', function closeMenuOnOutsideClick(event) {
    const menu = document.getElementById('sideMenu');
    const hamburger = document.querySelector('.hamburger');

    if (!menu || !hamburger) return;
    if (menu.contains(event.target) || hamburger.contains(event.target)) return;

    menu.style.display = 'none';
});
