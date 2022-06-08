const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all users
router.get('/users', (req, res) => {
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
router.get('/user/:id', (req, res) => {
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
router.delete('/user/:id', (req, res) => {
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
router.put('/user/:id', (req, res) => {

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
router.post('/user', ({ body }, res) => {
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

module.exports = router;