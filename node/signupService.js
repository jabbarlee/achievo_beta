const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Database connect
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '2103',
    port: 5432,
});

//Sign up POST request
app.post('/signup', cors(), (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);
    pool.query('insert into users_data (username, "password") values($1, $2)', [username, password], (err, result) => {
        if(err){
            console.log('Error inserting to database' + err);
            res.status(500).send('Database error');
        }else {
            res.json({ message: `${username}` });
        }
    });
})

//GET request for login logic
app.get('/login', cors(), async (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;

        const result = await pool.query('SELECT * FROM users_data WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            res.json({ success: true, username: result.rows[0].username });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false });
    }
});

/*-------------------------INDEX.HTML REQUESTS--------------------------*/
app.post('/insertTask', cors(), (req, res) => {
    const username = req.body.username;
    const task = req.body.data;

    pool.query('insert into tasks (username, task_name, is_checked) values($1, $2, false)', [username, task], (err, result) => {
        if(err){
          console.log('Error inserting to database' + err);
          res.status(500).send('Database error');
        }else {
          res.send('Data inserted successfully');
        }
    });
})

app.delete('/deleteData', cors(), async (req, res) => {
    try {
        const { username, data } = req.body;
        await pool.connect();

        const result = await pool.query(
        'DELETE FROM tasks WHERE username = $1 AND task_name = $2',
        [username, data]
        );

        // Check if a row was deleted
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*-----------------------Load Checkboxes-------------------------------*/
app.get('/loadCheckboxes', cors(), async(req, res) => {
    try {
        const username = req.query.username;
        const result = await pool.query('select task_name, is_checked from tasks where username = $1 ORDER BY CASE WHEN is_checked = false THEN 0 ELSE 1 END, is_checked', [username]);
        res.json(result.rows);
        console.log('Server Response:', result.rows);
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false });
        }
})

app.get('/getPoints', cors(), async(req, res) => {
    try {
        const username = req.query.username;
        const result = await pool.query('SELECT COUNT(*) FROM tasks where username = $1 and is_checked = true', [username]);
        const rowCount = result.rows[0].count;
        res.json({ rowCount });
      } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
      } 
})

app.post('/updateCheckboxState', cors(), async (req, res) => {
    const isChecked = req.body.isChecked;
    const username = req.body.username;
    const checkboxName = req.body.checkboxName;
    try{
        const result = await pool.query('update tasks set is_checked = $1 where username = $2 and task_name = $3', [isChecked, username, checkboxName]);

        console.log(`Checkbox ${checkboxName} state updated to ${isChecked}.`);
        res.send('Checkbox state updated successfully');
    }catch(error){
        console.error('Error updating checkbox state in the database:', error);
        res.status(500).send('Internal Server Error');
    }
})

/*--------------------------*/
app.listen(port, () => {
    console.log('Server is running');
});