const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get daily sales data for a specific month and year (now counting orders)
router.get('/sales/daily/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;

    // Validate year and month parameters (basic validation)
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month parameter' });
    }

    // SQL query to get the number of sales (orders) per day for the specified month and year
    // Assumes 'sale_time' is a DATETIME column in the 'sale' table
    // Assumes 'sale_id' can be counted to represent an order
    const [dailyOrders] = await db.query(
      'SELECT DAY(sale_time) as day, COUNT(sale_id) as order_count \
       FROM sale \
       WHERE YEAR(sale_time) = ? AND MONTH(sale_time) = ? \
       GROUP BY DAY(sale_time) \
       ORDER BY DAY(sale_time)',
      [year, month]
    );

    // Renaming the result key for clarity on the frontend
    const formattedDailyData = dailyOrders.map(item => ({
        day: item.day,
        count: item.order_count // Use 'count' to avoid conflict with original 'total_sales'
    }));

    res.json(formattedDailyData);

  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 