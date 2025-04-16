const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
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