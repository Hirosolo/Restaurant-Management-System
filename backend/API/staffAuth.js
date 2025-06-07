const express = require('express');
const router = express.Router();
const { authenticateStaff, authenticateToken } = require('../middleware/auth');
const db = require('../config/db'); // Import db module

// Staff login endpoint
router.post('/login', authenticateStaff);

// Get current authenticated staff user (validate token)
router.get('/me', authenticateToken, (req, res) => {
  // authenticateToken middleware should have populated req.user if token is valid
  if (req.user) {
    res.json(req.user);
  } else {
    // This case should ideally not be reached if authenticateToken works correctly
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Get all employee salaries
router.get('/salaries', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all employee salaries for authenticated staff...'); // Add log
    // Assuming you have a table named 'staff' with columns 'staff_name', 'role', and 'pay_rates'
    const [employees] = await db.query(`
      SELECT
        staff_name as name,
        role,
        pay_rates as pay_rate
      FROM staff
    `);
    console.log('Employee salaries fetched.', employees.length);
    res.json({ success: true, employees: employees });
  } catch (error) {
    console.error('Error fetching employee salaries:', error);
    res.status(500).json({ success: false, message: 'Error fetching employee salaries' });
  }
});

// New endpoint to get all staff members
router.get('/all', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all staff members for authenticated staff...');
    const [staffMembers] = await db.query(`
      SELECT
        staff_id,
        staff_name,
        staff_email,
        role,
        phone
      FROM staff
    `);
    console.log('Staff members fetched.', staffMembers.length);
    res.json({ success: true, staff: staffMembers });
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ success: false, message: 'Error fetching staff members' });
  }
});

module.exports = router; 