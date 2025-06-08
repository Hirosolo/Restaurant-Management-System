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
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required.' });
    }
    console.log(`Fetching employee salaries for month: ${month}, year: ${year}`);
    // Only count shifts in the selected month/year, 8 hours per shift
    const [employees] = await db.query(`
      SELECT
        s.staff_id,
        s.staff_name AS name,
        s.role,
        s.pay_rates AS pay_rate,
        COUNT(sc.schedule_id) AS working_shifts,
        COUNT(sc.schedule_id) * 8 AS working_hours, -- 8 hours per shift
        (COUNT(sc.schedule_id) * 8) * s.pay_rates AS total_pay
      FROM staff s
      LEFT JOIN schedule sc ON s.staff_id = sc.staff_id
        AND MONTH(sc.shift_date) = ? AND YEAR(sc.shift_date) = ?
      GROUP BY s.staff_id, s.staff_name, s.role, s.pay_rates
    `, [month, year]);
    console.log('Employee salaries fetched.', employees.length);
    res.json({ success: true, employees: employees });
  } catch (error) {
    console.error('Error fetching employee salaries:', error);
    res.status(500).json({ success: false, message: 'Error fetching employee salaries' });
  }
});

// Endpoint to get the authenticated staff member's salary and working hours for a given month/year
router.get('/salary', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const staffId = req.user && req.user.staff_id;
    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required.' });
    }
    if (!staffId) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    // Query for this staff member's working hours and salary
    const [result] = await db.query(`
      SELECT
        s.staff_id,
        s.staff_name AS name,
        s.role,
        s.pay_rates AS pay_rate,
        COUNT(sc.schedule_id) AS working_shifts,
        COUNT(sc.schedule_id) * 8 AS working_hours, -- 8 hours per shift
        (COUNT(sc.schedule_id) * 8) * s.pay_rates AS salary
      FROM staff s
      LEFT JOIN schedule sc ON s.staff_id = sc.staff_id
        AND MONTH(sc.shift_date) = ? AND YEAR(sc.shift_date) = ?
      WHERE s.staff_id = ?
      GROUP BY s.staff_id, s.staff_name, s.role, s.pay_rates
    `, [month, year, staffId]);
    if (result.length === 0) {
      return res.json({ hours: 0, salary: 0 });
    }
    const { working_hours, salary } = result[0];
    res.json({ hours: working_hours, salary });
  } catch (error) {
    console.error('Error fetching staff salary:', error);
    res.status(500).json({ success: false, message: 'Error fetching staff salary' });
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