const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

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

app.listen(port, () => {
    console.log('Server is running');
});