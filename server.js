const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'WellyisC00l!',
        database: 'social'
    },
    console.log('Connected to the social database.')
);

//GET all platforms
app.get('/api/platforms', (req, res) => {
    const sql = `SELECT * FROM platforms`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//GET a single platform
app.get('/api/platform/:id', (req, res) => {
    const sql = `SELECT * FROM platforms WHERE id=?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Delete a platform
app.delete('/api/platform/:id', (req, res) => {
    sql = `DELETE FROM platforms WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Platform not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    const sql = `SELECT users.*, platforms.name 
    AS platform_name
    FROM users
    LEFT JOIN platforms
    ON users.platform_id = platforms.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get a single user
app.get('/api/user/:id', (req, res) => {
    const sql = `SELECT users.*, platforms.name 
    AS platform_name
    FROM users
    LEFT JOIN platforms
    ON users.platform_id = platforms.id
    WHERE users.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a user
app.delete('/api/user/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'user not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Update a user's platform
app.put('/api/user/:id', (req, res) => {

    const errors = inputCheck(req.body, 'platform_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE users SET platform_id = ? 
                 WHERE id = ?`;
    const params = [req.body.platform_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'user not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// Create a user
// const sql = `INSERT INTO users (id, username, clan_connected) 
//               VALUES (?,?,?)`;
// const params = [1, 'jonyprill', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });
// Create a user
app.post('/api/user', ({ body }, res) => {
    const errors = inputCheck(body, 'username', 'clan_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO users (username, clan_connected)
  VALUES (?,?)`;
    const params = [body.username, body.clan_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});