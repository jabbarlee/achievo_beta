const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

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

    pool.query('insert into tasks (username, task_name) values($1, $2)', [username, task], (err, result) => {
        if(err){
          console.log('Error inserting to database' + err);
          res.status(500).send('Database error');
        }else {
          res.send('Data inserted successfully');
        }
    });
})



/*--------------------------*/
app.listen(port, () => {
    console.log('Server is running');
});