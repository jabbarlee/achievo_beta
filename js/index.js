'use strict'

document.addEventListener('DOMContentLoaded', async() => {
    const username = localStorage.getItem('loginUsernameSuccess');
    const displayUsername = document.getElementById('usernameDisplay');
    displayUsername.textContent = username;

    const insertButton = document.getElementById('insertButton');
    const deleteButton = document.getElementById('deleteButton');
    const editButton = document.getElementById('editButton');
    const editLabelButton = document.getElementById('editLabelButton');
    const cancelButton = document.getElementById('cancelButton');
    const editInput = document.getElementById('editInput');
    const test = document.getElementById('test');
    const taskInput = document.getElementById('taskName');
    const pointsLabel = document.getElementById('pointsLabel'); 
    const checkedTasksDiv = document.getElementById('checkedTasks');
    const completedTasksLabel = document.getElementById('completedTasksLabel');

    completedTasksLabel.style.cursor = 'pointer';
    completedTasksLabel.style.color = '#1d3557';

    function getRowCount() {
        fetch(`http://localhost:3000/getPoints?username=${username}`)
            .then(response => response.json())
            .then(data => {
                pointsLabel.textContent = data[0].points;
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    class CheckboxManager {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
        }
    
        createCheckboxes(checkboxName, isChecked) {
            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.name = checkboxName;
            newCheckbox.checked = isChecked;
    
            const label = document.createElement('label');
            label.appendChild(newCheckbox);
            label.appendChild(document.createTextNode(' '));
            label.appendChild(document.createTextNode(checkboxName));
            const br = document.createElement('br');
    
            this.container.appendChild(label);
            this.container.appendChild(br);

            label.addEventListener('mouseover', () => {
                label.style.backgroundColor = 'aliceblue';
                label.style.borderRadius = '5px';

            })
            label.addEventListener('mouseout', () => {
                label.style.backgroundColor = '#cbdfbd';
            })
            label.addEventListener('click', (event) => {
                editInput.value = checkboxName;
            })
        }

        deleteTasks() {
            const tasks = this.container.querySelectorAll('label');
            const breaks = this.container.querySelectorAll('br');
            breaks.forEach(br => br.remove());
            tasks.forEach(label => label.remove());
            this.container.appendChild(document.createElement('br'));
        }
    }

    const checkboxManager = new CheckboxManager('uncheckedTasks');
    const checkboxManagerForChecked = new CheckboxManager('checkedTasks');

    completedTasksLabel.addEventListener('click', () => {
        if(checkedTasksDiv.style.display === 'none'){
            checkedTasksDiv.style.display = 'block';
            checkboxManagerForChecked.deleteTasks();
            completedTasksLabel.textContent = ' < Completed Tasks';
            loadCheckedCheckboxes();
        }else{
            checkedTasksDiv.style.display = 'none';
            completedTasksLabel.textContent = ' > Completed Tasks';
        }
    })

    function loadCheckedCheckboxes(){
        fetch(`http://localhost:3000/loadCompletedCheckboxes?username=${username}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    checkboxManagerForChecked.createCheckboxes(item.task_name, item.is_checked);
                });
                getRowCount();
            })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch data and create checkboxes
    function loadCheckboxes() {
        fetch(`http://localhost:3000/loadCheckboxes?username=${username}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    checkboxManager.createCheckboxes(item.task_name, item.is_checked);
                });
                getRowCount();
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    loadCheckboxes();

    async function handleCheckboxChange(event) {
        const username = localStorage.getItem('loginUsernameSuccess');
        const checkbox = event.target;
        const checkboxName = checkbox.name;
        const isChecked = checkbox.checked;
     
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
                getRowCount();
            } else {
                console.error('Error updating checkbox state:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating checkbox state in the database:', error);
        }
    }
    checkboxContainer.addEventListener('change', handleCheckboxChange);

    insertButton.addEventListener('click', async(e) => {
        e.preventDefault();

        const data = document.querySelector('input[name="task"]').value;
  
        if(data == ''){
            console.log('Insert task name');

        }else{
            const response = await fetch('http://localhost:3000/insertTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `data=${data}&username=${username}`,
            });

            if (response.ok) {
                const responseData = await response.text();
                document.querySelector('input[name="task"]').value = '';
                checkboxManager.deleteTasks();
                loadCheckboxes();
            } else {
                console.error('POST request failed');
            }
        }
    })
    editLabelButton.addEventListener('click', async(e) => {
        e.preventDefault();

        const data = document.querySelector('input[name="editTask"]').value;
        const usernameLogged = localStorage.getItem('loginUsernameSuccess');

        if(data == ''){
            test.textContent = 'Select a task to edit';
        }else{
            console.log('dsf');
        }
    })

    deleteButton.addEventListener('click', async(e) => {
        e.preventDefault();
        const data = document.querySelector('input[name="editTask"]').value;
        //const data = dataSelected.slice(1);
        const username = localStorage.getItem('loginUsernameSuccess');

        if(data == ''){
            test.textContent = 'Select a task to edit';
        }else{
            console.log(`${data} has been deleted`);
            try {
                const response = await fetch('http://localhost:3000/deleteData', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, data }),
                });
                const result = await response.json();
                checkboxManager.deleteTasks();
                getRowCount();
                loadCheckboxes();
                checkboxManagerForChecked.deleteTasks();  
                loadCheckedCheckboxes();
                editInput.value = '';
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user. Please check the console for details.');
            }
        }
    })

    //Open tab
    editButton.addEventListener('click',  function showButtons(){
        deleteButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');
        insertButton.classList.add('hidden');
        editButton.classList.add('hidden');
        editLabelButton.classList.remove('hidden');
        editInput.classList.remove('hidden');
        taskInput.classList.add('hidden');
    });
    cancelButton.addEventListener('click', () => {
        deleteButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        insertButton.classList.remove('hidden');
        editButton.classList.remove('hidden');
        editLabelButton.classList.add('hidden');
        taskInput.classList.remove('hidden');
        editInput.classList.add('hidden');
    })
});