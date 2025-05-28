const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./API/recipe');
const userRoutes = require('./API/user');
const orderRoutes = require('./API/order');
require('dotenv').config();

// const testRoutes = require('./routes/test'); 
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Initialize database
require('./initDb');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    next();
});

// Debug logging for route registration
console.log('Registering routes...');

// Routes
// app.use('/api/test', testRoutes); 
app.use('/api', recipeRoutes);
console.log('Recipe routes registered');

app.use('/api', userRoutes);
console.log('User routes registered');

app.use('/api/orders', orderRoutes);
console.log('Order routes registered');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({
        message: 'Not Found',
        path: req.url
    });
}); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});