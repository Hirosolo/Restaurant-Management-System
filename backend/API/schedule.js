const express = require('express');
const router = express.Router();
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

    // Fetch shifts and staff details for the week
    const [shifts] = await db.query(`
      SELECT
        s.schedule_id,
        s.shift_date,
        s.shift,
        st.staff_id,
        st.staff_name,
        st.role
      FROM schedule s
      JOIN staff st ON s.staff_id = st.staff_id
      WHERE DATE(s.shift_date) BETWEEN ? AND ?
      ORDER BY s.shift_date, s.shift
    `, [formattedStartDate, formattedEndOfWeek]);

    // Group shifts by date and then by shift type (Morning/Evening)
    const scheduleData = {};
    shifts.forEach(shift => {
      const shiftDate = new Date(shift.shift_date).getDate(); // Get day of the month
      const shiftTime = shift.shift; // Morning or Evening

      if (!scheduleData[shiftDate]) {
        scheduleData[shiftDate] = {};
      }

      if (!scheduleData[shiftDate][shiftTime]) {
        scheduleData[shiftDate][shiftTime] = {
          id: `${shiftDate}-${shiftTime}`, // Unique ID for the shift block
          time: shiftTime === 'Morning' ? '08:00 - 15:00' : '15:00 - 22:00', // Map to time string
          shift: shiftTime, // Include the raw shift type
          staff: []
        };
      }

      // Add staff member to the shift block
      scheduleData[shiftDate][shiftTime].staff.push({
        id: shift.staff_id,
        name: shift.staff_name,
        role: shift.role,
        // You might add avatar/color logic here or in frontend
        // For now, using a placeholder structure similar to the old data
        avatar: '👤', // Placeholder avatar
        color: '#CCCCCC' // Placeholder color
      });
    });

    // Convert nested object to the desired array format for frontend
    const formattedSchedule = Object.keys(scheduleData).map(dateKey => ({
        date: parseInt(dateKey, 10), // Day of the month
        shifts: Object.values(scheduleData[dateKey]) // Array of shift blocks for the day
    }));


    console.log('Shift data fetched and formatted.', formattedSchedule.length);
    res.json({ success: true, schedule: formattedSchedule });

  } catch (error) {
    console.error('Error fetching shift data:', error);
    res.status(500).json({ success: false, message: 'Error fetching shift data' });
  }
});

// Add a new schedule entry (assign staff to a shift)
router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    const { shift_date, shift, staff_id } = req.body;

    if (!shift_date || !shift || !staff_id) {
      return res.status(400).json({ success: false, message: 'shift_date, shift, and staff_id are required' });
    }

    // Validate shift type
    if (shift !== 'Morning' && shift !== 'Evening') {
        return res.status(400).json({ success: false, message: 'Invalid shift type. Must be \'Morning\' or \'Evening\'' });
    }

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

    res.status(201).json({ success: true, message: 'Staff assigned to shift successfully', scheduleId: result.insertId });

  } catch (error) {
    console.error('Error adding staff to shift:', error);
    res.status(500).json({ success: false, message: 'Error assigning staff to shift' });
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