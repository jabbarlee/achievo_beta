'use strict'
document.addEventListener("DOMContentLoaded", function () {
    const finalUsername = localStorage.getItem('finalUsername');
    document.getElementById('usernameDisplay').textContent = finalUsername;
});