const indexWebpage = 'file:///C:/Users/amilj/Documents/achievo_beta/index.html';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('usernameValue').value;
        const password = document.getElementById('passwordValue').value;
    
        fetch(`http://localhost:3000/login?username=${username}&password=${password}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    //document.getElementById('loginResult').textContent = `Welcome, ${data.username}!`;
                    document.getElementById('usernameValue').value = '';
                    document.getElementById('passwordValue').value = '';

                    const loginUsernameSuccess = `${data.username}`;
                    localStorage.setItem('loginUsernameSuccess', loginUsernameSuccess);
                    window.open(indexWebpage, '_self');
                } else {
                    document.getElementById('loginResult').textContent = 'Invalid username or password.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
})