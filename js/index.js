'use strict'

document.addEventListener('DOMContentLoaded', async() => {

    const username = localStorage.getItem('loginUsernameSuccess');
    const displayUsername = document.getElementById('usernameDisplay');
    displayUsername.textContent = username;

    const insertButton = document.getElementById('insertButton');
    const dataForm = document.getElementById('dataForm');
    const test = document.getElementById('test');


    const checkboxContainer = document.getElementById('checkboxContainer');
    function createCheckboxes(checkboxName, isChecked){
        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.name = checkboxName;
        newCheckbox.checked = isChecked;

        const label = document.createElement('label');
        label.appendChild(newCheckbox);
        label.appendChild(document.createTextNode(' '));
        label.appendChild(document.createTextNode(checkboxName));
        const br = document.createElement('br');
        const gap = document.createElement('a');

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(br);
    }

    async function handleCheckboxChange(event) {
        const username = localStorage.getItem('loginUsernameSuccess');
        const checkbox = event.target;
        const checkboxName = checkbox.name;
        const isChecked = checkbox.checked;
    
        if (isChecked) {
            console.log(`Checkbox ${checkboxName} is checked: ${isChecked}.`);
        } else {
            console.log(`Checkbox ${checkboxName} is unchecked: ${isChecked}.`);
            // Add your logic for when the checkbox is unchecked
        }
    
        // Pass the correct arguments to the function
        await updateCheckboxStateInDatabase(isChecked, username, checkboxName);
    }
    
    async function updateCheckboxStateInDatabase(isChecked, username, checkboxName) {
        console.log(`${checkboxName} in ${username} has been ${isChecked}`);
        try {
            const response = await fetch('http://localhost:3000/updateCheckboxState', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `isChecked=${isChecked}&username=${username}&checkboxName=${checkboxName}`,
            });
            if (response.ok) {
                const responseData = await response.text();
                console.log(responseData);
            } else {
                console.error('Error updating checkbox state:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating checkbox state in the database:', error);
        }
    }
    

    checkboxContainer.addEventListener('change', handleCheckboxChange);

    function loadCheckboxes(){
        fetch(`http://localhost:3000/loadCheckboxes?username=${username}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                createCheckboxes(item.task_name, item.is_checked);
        });
    })
    } 

    insertButton.addEventListener('click', async(e) => {
        e.preventDefault();

        const data = document.querySelector('input[name="task"]').value;
        const usernameLogged = localStorage.getItem('loginUsernameSuccess');
  
        if(data == ''){
            console.log('Insert task name');

        }else{
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
                document.querySelector('input[name="task"]').value = '';
                location.reload();
            } else {
                console.error('POST request failed');
            }
        }
    })

    loadCheckboxes();
});