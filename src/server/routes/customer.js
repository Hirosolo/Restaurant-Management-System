const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Get customer address
router.get('/address', authenticateToken, (req, res) => {
  const customerId = req.user.customer_id;

  const query = `
    SELECT ward, district, street, house_number, building_name, block, floor, room_number, delivery_instructions
    FROM Customer
    WHERE customer_id = ?
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching address:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(results[0]);
  });
});

module.exports = router;