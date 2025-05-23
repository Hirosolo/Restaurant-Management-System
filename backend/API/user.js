const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

console.log('Setting up user routes...');

// Register new user
router.post('/users/register', async (req, res) => {
    console.log('Received registration request:', req.body);
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            contactMobile,
            address
        } = req.body;

        // Check if email already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM customer WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.query(
            `INSERT INTO customer 
            (customer_name, phone, password, email, loyalty_point) 
            VALUES (?, ?, ?, ?, ?)`,
            [`${firstName} ${lastName}`, contactMobile, hashedPassword, email, 0]
        );

        // Get the inserted user data (excluding password)
        const [newUser] = await db.query(
            'SELECT customer_id, customer_name, email, phone, loyalty_point FROM customer WHERE customer_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser[0]
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Sign in user
router.post('/users/signin', async (req, res) => {
    console.log('Received sign in request:', req.body);
    try {
        const { email, password } = req.body;

        // Find user by email
        const [users] = await db.query(
            'SELECT * FROM customer WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Compare password (temporarily using plain text comparison)
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            message: 'Sign in successful',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({
            success: false,
            message: 'Error signing in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

console.log('User routes setup complete');

module.exports = router; 