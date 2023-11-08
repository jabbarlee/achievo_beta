const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '2103',
    port: 5432,
});

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

app.listen(port, () => {
    console.log('Server is running');
});