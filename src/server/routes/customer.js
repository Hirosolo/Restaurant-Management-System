const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Customer login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT * FROM Customer WHERE email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching customer:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const customer = results[0];
    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ customer_id: customer.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// Register a new customer
router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    ward,
    district,
    street,
    house_number,
    building_name,
    block,
    floor,
    room_number,
    delivery_instructions,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO Customer (
        first_name, last_name, email, password, phone, ward, district, street, house_number,
        building_name, block, floor, room_number, delivery_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      phone,
      ward || null,
      district || null,
      street || null,
      house_number || null,
      building_name || null,
      block || null,
      floor || null,
      room_number || null,
      delivery_instructions || null,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error registering customer:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Server error' });
      }

      const customerId = result.insertId;
      const token = jwt.sign({ customer_id: customerId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'Customer registered successfully', token });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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