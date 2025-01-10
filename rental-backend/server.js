const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'qwerty@254.', // Your MySQL password
    database: 'rentals'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database');
});

// User login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ?`;

    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (err) throw err;
                if (match) {
                    const token = jwt.sign(
                        { id: result[0].id, user_type: result[0].user_type },
                        'secretkey',
                        { expiresIn: '1h' }
                    );
                    res.json({
                        message: 'Login successful',
                        token,
                        user_type: result[0].user_type // Include user_type in the response
                    });
                } else {
                    res.status(400).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    });
});

// User registration endpoint
app.post('/register', (req, res) => {
    const { username, password, email, phone, user_type } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        const query = `INSERT INTO users (username, password, email, phone, user_type) VALUES (?, ?, ?, ?, ?)`;

        db.query(query, [username, hashedPassword, email, phone, user_type], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'User already exists' });
                }
                throw err;
            }
            res.json({ message: 'User registered successfully' });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
