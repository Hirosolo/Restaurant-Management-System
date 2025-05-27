const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

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
            (customer_name, phone, password, email, loyalty_point, address) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [`${firstName} ${lastName}`, contactMobile, hashedPassword, email, 0, address]
        );

        // Get the inserted user data (excluding password)
        const [newUser] = await db.query(
            'SELECT customer_id, customer_name, email, phone, loyalty_point, address FROM customer WHERE customer_id = ?',
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

        console.log('Found users:', users.length > 0 ? 'Yes' : 'No');

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];
        console.log('User found:', {
            id: user.customer_id,
            email: user.email,
            passwordType: user.password.startsWith('$2') ? 'hashed' : 'plain'
        });

        let passwordMatch = false;

        // Check if password is hashed (starts with $2)
        if (user.password.startsWith('$2')) {
            console.log('Comparing with bcrypt');
            // Compare with bcrypt
            passwordMatch = await bcrypt.compare(password, user.password);
            console.log('Bcrypt comparison result:', passwordMatch);
        } else {
            console.log('Comparing plain text passwords');
            // Compare plain text password
            passwordMatch = password === user.password;
            console.log('Plain text comparison result:', passwordMatch);
            
            // If password matches and is plain text, hash it and update the database
            if (passwordMatch) {
                console.log('Password matched, hashing and updating...');
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.query(
                    'UPDATE customer SET password = ? WHERE customer_id = ?',
                    [hashedPassword, user.customer_id]
                );
                console.log('Password updated to hashed version');
            }
        }

        if (!passwordMatch) {
            console.log('Password did not match');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: user.customer_id,
                email: user.email,
                type: 'customer'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Sign in successful, token generated');

        // Return user data (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            message: 'Sign in successful',
            token,
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