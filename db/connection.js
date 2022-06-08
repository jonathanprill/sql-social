const mysql = require('mysql2');

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

module.exports = db;