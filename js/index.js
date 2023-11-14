'use strict'

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('loginUsernameSuccess');
    const displayUsername = document.getElementById('usernameDisplay');
    displayUsername.textContent = username;
});