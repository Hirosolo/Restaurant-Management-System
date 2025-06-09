console.log('Staff management API loaded');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all staff
router.get('/all', auth.authenticateToken, async (req, res) => {
  try {
    const [staff] = await db.query('SELECT staff_id, staff_name, staff_email, role, phone FROM staff');
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
});

// Update staff by ID
router.put('/:id', auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { staff_name, staff_email, role, phone } = req.body;
  console.log('PUT /api/staff/:id called', id, req.body);
  try {
    const [result] = await db.query(
      'UPDATE staff SET staff_name = ?, staff_email = ?, role = ?, phone = ? WHERE staff_id = ?',
      [staff_name, staff_email, role, phone, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    res.json({ success: true, message: 'Staff updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update staff' });
  }
});

// Create new staff
router.post('/', auth.authenticateToken, async (req, res) => {
  const { staff_name, staff_email, role, phone, password } = req.body;
  if (!staff_name || !staff_email || !role || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    // Check for duplicate email
    const [existing] = await db.query('SELECT staff_id FROM staff WHERE staff_email = ?', [staff_email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    // Insert new staff
    await db.query(
      'INSERT INTO staff (staff_name, staff_email, role, phone, password) VALUES (?, ?, ?, ?, ?)',
      [staff_name, staff_email, role, phone, password]
    );
    res.status(201).json({ success: true, message: 'Staff created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create staff' });
  }
});

// Delete staff by ID
router.delete('/:id', auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM staff WHERE staff_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete staff' });
  }
});

module.exports = router;
