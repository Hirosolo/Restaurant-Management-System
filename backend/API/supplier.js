const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const [suppliers] = await db.query('SELECT supplier_id, supplier_name, phone, address FROM supplier');
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 