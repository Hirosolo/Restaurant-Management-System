console.log('Schedule API loaded');
const express = require('express');
const router = express.Router();

// Debug: log every request to this API
router.use((req, res, next) => {
  console.log('Schedule API received:', req.method, req.url);
  next();
});
const db = require('../config/db');
const auth = require('../middleware/auth');

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get shifts for a specific week starting from a given date
router.get('/week', auth.authenticateToken, async (req, res) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ success: false, message: 'startDate query parameter is required' });
    }

    const startOfWeek = new Date(startDate);
    // Calculate end date for the week (startDate + 6 days)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formattedStartDate = formatDate(startOfWeek);
    const formattedEndOfWeek = formatDate(endOfWeek);

    console.log(`Fetching shifts for week starting from ${formattedStartDate} to ${formattedEndOfWeek}`);

    // Fetch all schedule blocks (including those with NULL staff_id)
    const [shifts] = await db.query(`
      SELECT
        s.schedule_id,
        s.shift_date,
        s.shift,
        st.staff_id,
        st.staff_name,
        st.role
      FROM schedule s
      LEFT JOIN staff st ON s.staff_id = st.staff_id
      WHERE DATE(s.shift_date) BETWEEN ? AND ?
      ORDER BY s.shift_date, s.shift, s.schedule_id
    `, [formattedStartDate, formattedEndOfWeek]);

    // Only include shift blocks that exist in the database (have shift_date and shift)
    const scheduleData = {};
    shifts.forEach(shift => {
      if (!shift.shift_date || !shift.shift) return;
      const shiftDateString = new Date(shift.shift_date).toISOString().slice(0, 10);
      const shiftTime = shift.shift;
      if (!scheduleData[shiftDateString]) scheduleData[shiftDateString] = {};
      if (!scheduleData[shiftDateString][shiftTime]) {
        scheduleData[shiftDateString][shiftTime] = {
          id: `${shiftDateString}-${shiftTime}`,
          time: shiftTime === 'Morning' ? '08:00 - 15:00' : '15:00 - 22:00',
          shift: shiftTime,
          staff: []
        };
      }
      if (shift.staff_id) {
        scheduleData[shiftDateString][shiftTime].staff.push({
          id: shift.staff_id,
          name: shift.staff_name,
          role: shift.role,
          schedule_id: shift.schedule_id,
          avatar: '👤',
          color: '#CCCCCC'
        });
      }
    });
    // Convert to frontend format
    const formattedSchedule = Object.keys(scheduleData).map(dateKey => ({
      date: dateKey, // Use the full date string as the key
      shifts: Object.values(scheduleData[dateKey])
    }));

    console.log('Shift data fetched and formatted.', formattedSchedule.length);
    res.json({ success: true, schedule: formattedSchedule });

  } catch (error) {
    console.error('Error fetching shift data:', error);
    res.status(500).json({ success: false, message: 'Error fetching shift data' });
  }
});

// Add a new schedule entry (assign staff to a shift) or create a shift block (manager)
router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    const { shift_date, shift, staff_id } = req.body;

    if (!shift_date || !shift) {
      return res.status(400).json({ success: false, message: 'shift_date and shift are required' });
    }

    // Validate shift type
    if (shift !== 'Morning' && shift !== 'Evening' && shift !== 'morning' && shift !== 'evening') {
        return res.status(400).json({ success: false, message: 'Invalid shift type. Must be \'Morning\' or \'Evening\'' });
    }

    // Prevent creating a shift before today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    const shiftDateObj = new Date(shift_date);
    shiftDateObj.setHours(0, 0, 0, 0);
    if (shiftDateObj < today) {
      return res.status(400).json({ success: false, message: 'Cannot create a shift before today.' });
    }

    // If staff_id is provided, assign staff to shift
    if (staff_id) {
      console.log(`Adding staff ${staff_id} to ${shift} shift on ${shift_date}`);
      // Check if this staff member is already assigned to a shift on this date and time
      const [existingEntry] = await db.query(
          'SELECT schedule_id FROM schedule WHERE DATE(shift_date) = DATE(?) AND shift = ? AND staff_id = ?',
          [shift_date, shift, staff_id]
      );
      if (existingEntry.length > 0) {
          return res.status(409).json({ success: false, message: 'Staff member already assigned to this shift on this date.' });
      }
      // Insert into schedule table
      const [result] = await db.query(
        'INSERT INTO schedule (shift_date, shift, staff_id) VALUES (?, ?, ?)',
        [shift_date, shift, staff_id]
      );
      return res.status(201).json({ success: true, message: 'Staff assigned to shift successfully', scheduleId: result.insertId });
    } else {
      // Manager creating a shift block (no staff assigned yet)
      // Check if a shift block already exists (any entry for this date+shift)
      const [existingBlock] = await db.query(
        'SELECT schedule_id FROM schedule WHERE DATE(shift_date) = DATE(?) AND shift = ?',
        [shift_date, shift]
      );
      if (existingBlock.length > 0) {
        return res.status(409).json({ success: false, message: 'Shift already exists for this date and type.' });
      }
      // Insert a placeholder row with NULL staff_id
      const [result] = await db.query(
        'INSERT INTO schedule (shift_date, shift, staff_id) VALUES (?, ?, NULL)',
        [shift_date, shift]
      );
      return res.status(201).json({ success: true, message: 'Shift block created successfully', scheduleId: result.insertId });
    }
  } catch (error) {
    console.error('Error adding staff to shift:', error);
    res.status(500).json({ success: false, message: 'Error assigning staff to shift' });
  }
});

// Delete a shift block (all assignments for a date+shift)
router.delete('/block', auth.authenticateToken, async (req, res) => {
  try {
    console.log('DELETE /block handler entered', req.query);
    const { shift_date, shift } = req.query;
    if (!shift_date || !shift) {
      return res.status(400).json({ success: false, message: 'shift_date and shift are required' });
    }
    // Ensure only the date part is used for comparison
    const dateOnly = shift_date.slice(0, 10); // 'YYYY-MM-DD'
    // Delete all schedule entries for this date and shift
    console.log('DELETE query:', dateOnly, shift);
    const [result] = await db.query(
      'DELETE FROM schedule WHERE DATE(shift_date) = ? AND shift = ?',
      [dateOnly, shift]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No shift found for this date and type.' });
    }
    res.json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift block:', error);
    res.status(500).json({ success: false, message: 'Error deleting shift block' });
  }
});

// Delete a schedule entry (remove staff from a shift)
router.delete('/:scheduleId', auth.authenticateToken, async (req, res) => {
  try {
    const { scheduleId } = req.params;

    console.log(`Deleting schedule entry with ID: ${scheduleId}`);

    const [result] = await db.query('DELETE FROM schedule WHERE schedule_id = ?', [scheduleId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Schedule entry not found' });
    }

    res.json({ success: true, message: 'Staff removed from shift successfully' });

  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    res.status(500).json({ success: false, message: 'Error removing staff from shift' });
  }
});

module.exports = router;