const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to authenticate customer
const authenticateCustomer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Get customer from database
        const [customers] = await db.query(
            'SELECT * FROM customer WHERE email = ?',
            [email]
        );

        if (customers.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const customer = customers[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, customer.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: customer.customer_id,
                email: customer.email,
                type: 'customer'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: customer.customer_id,
                name: customer.customer_name,
                email: customer.email,
                type: 'customer'
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to authenticate staff
const authenticateStaff = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Get staff from database
        const [staff] = await db.query(
            'SELECT * FROM staff WHERE email = ?',
            [email]
        );

        if (staff.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const staffMember = staff[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, staffMember.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: staffMember.staff_id,
                email: staffMember.email,
                role: staffMember.role,
                type: 'staff'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: staffMember.staff_id,
                name: staffMember.staff_name,
                role: staffMember.role,
                type: 'staff'
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to check if user is staff
const isStaff = (req, res, next) => {
    if (req.user && req.user.type === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Staff only.' });
    }
};

// Middleware to check if user is manager
const isManager = (req, res, next) => {
    if (req.user && req.user.type === 'staff' && req.user.role === 'Manager') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Manager only.' });
    }
};

module.exports = {
    authenticateToken,
    authenticateCustomer,
    authenticateStaff,
    isStaff,
    isManager
}; 