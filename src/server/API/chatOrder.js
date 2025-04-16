// server/API/chatOrder.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// POST /api/chat-order
router.post('/', authenticateToken, async (req, res) => {
  const customerId = req.user.customer_id;
  const meals = req.body.meals;

  if (!Array.isArray(meals) || meals.length === 0) {
    return res.status(400).json({ message: 'Meals must be a non-empty array' });
  }

  try {
    // 1. Get all menu items from DB by name
    const names = meals.map((m) => m.name);
    const placeholders = names.map(() => '?').join(',');

    const [menuItems] = await db.promise().query(
      `SELECT * FROM MenuItem WHERE name IN (${placeholders})`,
      names
    );

    if (menuItems.length !== meals.length) {
      const foundNames = new Set(menuItems.map((m) => m.name));
      const missing = names.filter((n) => !foundNames.has(n));
      return res.status(404).json({ message: 'Some meals not found', missing });
    }

    // 2. Map meal name to MenuItem
    const itemMap = {};
    for (const item of menuItems) {
      itemMap[item.name] = item;
    }

    // 3. Compute total
    let total = 0;
    for (const meal of meals) {
      const item = itemMap[meal.name];
      total += item.price * meal.quantity;
    }

    const deliveryCharge = 2.5;
    total += deliveryCharge;

    // 4. Insert into Order
    const [orderResult] = await db.promise().query(
      `INSERT INTO \`Order\` (customer_id, total_amount, delivery_charge) VALUES (?, ?, ?)`,
      [customerId, total, deliveryCharge]
    );
    const orderId = orderResult.insertId;

    // 5. Insert into OrderItem
    const orderItems = meals.map((meal) => {
      const item = itemMap[meal.name];
      return [orderId, item.menu_item_id, meal.quantity, item.price, ''];
    });

    await db.promise().query(
      `INSERT INTO OrderItem (order_id, menu_item_id, quantity, price_at_time, note) VALUES ?`,
      [orderItems]
    );

    return res.status(201).json({ message: 'Order placed', order_id: orderId });
  } catch (err) {
    console.error('Error placing chat order:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
