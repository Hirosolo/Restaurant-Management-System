const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customer', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
