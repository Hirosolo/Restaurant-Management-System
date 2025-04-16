const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const menuRoutes = require('./routes/menu'); // Added menu routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/menu', menuRoutes); // Added menu route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});