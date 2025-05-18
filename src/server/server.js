const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const menuRoutes = require('./routes/menu'); 
// const testRoutes = require('./routes/test'); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/menu', menuRoutes); 
// app.use('/api/test', testRoutes); 

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
  res.status(404).json({
    message: 'Not Found',
    path: req.url
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});