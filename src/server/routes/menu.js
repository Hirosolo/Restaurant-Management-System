const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all menu items
router.get('/', (req, res) => {
  console.log('GET /api/menu hit');
  const query = `
    SELECT menu_item_id, name, description, price, category
    FROM MenuItem
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching menu:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

module.exports = router;