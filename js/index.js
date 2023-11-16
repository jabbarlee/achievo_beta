'use strict'

document.addEventListener('DOMContentLoaded', function () {

    const username = localStorage.getItem('loginUsernameSuccess');
    const displayUsername = document.getElementById('usernameDisplay');
    displayUsername.textContent = username;

    const insertButton = document.getElementById('insertButton');
    const dataForm = document.getElementById('dataForm');
    const test = document.getElementById('test');

    insertButton.addEventListener('click', async(e) => {
        e.preventDefault();
        console.log('Form submitted');

        const data = document.querySelector('input[name="task"]').value;
        const usernameLogged = localStorage.getItem('loginUsernameSuccess');
  
        const response = await fetch('http://localhost:3000/insertTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${data}&username=${usernameLogged}`,
        });

        if (response.ok) {
            const responseData = await response.text();
            test.textContent = responseData;
        } else {
            console.error('POST request failed');
        }
    })
});