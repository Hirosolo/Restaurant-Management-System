
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register a new customer
router.post('/register', async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      password,
      ward,
      district,
      street,
      house_number,
      building_name,
      block,
      floor,
      room_number
    } = req.body;

    // Validate required fields with specific messages
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone must not be empty.' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be a number with exactly 10 digits.' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email cannot be empty.' });
    }
    if (!ward) {
      return res.status(400).json({ success: false, message: 'Ward cannot be empty.' });
    }
    if (!district) {
      return res.status(400).json({ success: false, message: 'District cannot be empty.' });
    }
    if (!street) {
      return res.status(400).json({ success: false, message: 'Street cannot be empty.' });
    }
    if (!customer_name || !password || !house_number) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    // Validate email: must contain @ and a domain part
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }
    // Insert new customer
    await db.query(
      `INSERT INTO customer (customer_name, phone, email, password, ward, district, street, house_number, building_name, block, floor, room_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_name, phone, email, password, ward, district, street, house_number, building_name, block, floor, room_number]
    );
    res.json({ success: true, message: 'Customer registered successfully' });
  } catch (err) {
    console.error('Error registering customer:', err);
    res.status(500).json({ success: false, message: 'Error registering customer' });
  }
});

// Customer sign-in endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const [rows] = await db.query(
      'SELECT * FROM customer WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    // You may want to omit password from the response
    const customer = { ...rows[0] };
    delete customer.password;
    res.json({ success: true, customer });
  } catch (err) {
    console.error('Error signing in customer:', err);
    res.status(500).json({ success: false, message: 'Error signing in customer' });
  }
});

module.exports = router;
