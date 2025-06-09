const express = require('express');
const cors = require('cors');
const path = require('path'); // Require the path module
const recipeRoutes = require('./API/recipe');
const userRoutes = require('./API/user');
const orderRoutes = require('./API/order');
const staffAuthRoutes = require('./API/staffAuth');
const ingredientRoutes = require('./API/ingredient');
const restockRoutes = require('./API/restock');
const supplierRoutes = require('./API/supplier');
const salesRoutes = require('./API/sales'); // Import the new sales routes
const scheduleRoutes = require('./API/schedule'); // Import the new schedule routes
require('dotenv').config();

// const testRoutes = require('./routes/test'); 
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'], // Allow requests from React app and staff interface
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());

// Serve static files from the 'public' directory in the project root
app.use(express.static(path.join(__dirname, '..', 'public')));

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

app.use('/api/staff', staffAuthRoutes);
console.log('Staff authentication routes registered');

app.use('/api/staff', require('./API/staff'));
console.log('Staff management routes registered');

app.use('/api', ingredientRoutes);
console.log('Ingredient routes registered');

app.use('/api', restockRoutes);
console.log('Restock routes registered');

app.use('/api', supplierRoutes);
console.log('Supplier routes registered');

app.use('/api', salesRoutes); // Use the new sales routes
console.log('Sales routes registered');

// app.use('/api/schedules', scheduleRoutes); // Use the new schedule routes
// console.log('Schedule routes registered');

app.use('/api/schedules', require('./API/schedule'));
console.log('Schedule API loaded');

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