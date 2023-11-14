'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    const result = document.getElementById('result');
    const indexWebpage = 'file:///C:/Users/amilj/Documents/achievo_beta/landing.html';

    dataForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
        });

        if(response.ok){
            const data = await response.json();
            const finalUsername = data.message;
            result.textContent = finalUsername;

            localStorage.setItem('finalUsername', finalUsername);
            console.log('Local storage file name is: ' + finalUsername);
            window.open(indexWebpage, '_self');
        }else {
            // Error response
            result.textContent = 'Error occurred while sending the data.';
        }
    })
})