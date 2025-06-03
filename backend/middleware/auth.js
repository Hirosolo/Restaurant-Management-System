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

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        try {
            // Fetch staff user details from the database based on the user ID in the token
            console.log('Decoded token user payload:', user);

            const [staff] = await db.query(
                'SELECT staff_id, staff_name, staff_email, role FROM staff WHERE staff_id = ?',
                [user.id]
            );

            if (staff.length === 0) {
                console.error('Staff user not found for ID:', user.id);
                return res.status(404).json({ message: 'Staff user not found' });
            }

            // Attach the full staff user object to the request
            req.user = staff[0];
            next();
        } catch (error) {
            console.error('Error fetching staff user during token authentication:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
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

// Middleware to authenticate staff (for login)
const authenticateStaffLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Get staff from database
        const [staff] = await db.query(
            'SELECT staff_id, staff_email, password, role FROM staff WHERE staff_email = ?',
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
                email: staffMember.staff_email,
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
                email: staffMember.staff_email
            }
        });
    } catch (error) {
        console.error('Staff login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to authenticate customer JWT token (for protected routes)
const authenticateCustomerToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        // Ensure the token is for a customer
        if (user.type !== 'customer') {
            console.error('Token is not for a customer:', user);
            return res.status(403).json({ message: 'Access denied. Customer token required.' });
        }

        try {
            // Fetch customer details from the database based on the user ID in the token
            console.log('Decoded customer token payload:', user);

            const [customers] = await db.query(
                'SELECT customer_id, customer_name, email, phone, loyalty_point, address FROM customer WHERE customer_id = ?',
                [user.id]
            );

            if (customers.length === 0) {
                console.error('Customer not found for ID:', user.id);
                return res.status(404).json({ message: 'Customer not found' });
            }

            // Attach the full customer object to the request
            req.user = customers[0];
            next();
        } catch (error) {
            console.error('Error fetching customer during token authentication:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
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
    authenticateStaff: authenticateStaffLogin,
    authenticateCustomerToken,
    isStaff,
    isManager
}; 