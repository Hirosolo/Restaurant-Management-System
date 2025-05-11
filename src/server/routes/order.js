const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Place an order
router.post('/place', authenticateToken, (req, res) => {
  const customerId = req.user.customer_id; // From JWT
  const { cart, contactNumber, deliveryAddress, notes } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0) + 2.50; // Add delivery charge

  // Start a transaction to ensure data consistency
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Insert into Order table
    const orderQuery = `
      INSERT INTO \`Order\` (customer_id, total_amount, order_status)
      VALUES (?, ?, 'pending')
    `;
    db.query(orderQuery, [customerId, totalAmount], (err, orderResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error inserting order:', err);
          res.status(500).json({ message: 'Server error' });
        });
      }

      const orderId = orderResult.insertId;

      // Insert into OrderItem table
      const orderItemsQuery = `
        INSERT INTO OrderItem (order_id, menu_item_id, quantity, price_at_time, note)
        VALUES ?
      `;
      const orderItemsValues = cart.map((item, index) => [
        orderId,
        item.id, // Assuming item.id matches menu_item_id in MenuItem table
        item.quantity,
        item.price,
        notes[index] || null,
      ]);

      db.query(orderItemsQuery, [orderItemsValues], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error inserting order items:', err);
            res.status(500).json({ message: 'Server error' });
          });
        }

        // Insert into Delivery table
        const deliveryQuery = `
          INSERT INTO Delivery (
            order_id, ward, district, street, house_number, building_name, block, floor, room_number, delivery_instructions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const deliveryValues = [
          orderId,
          deliveryAddress.ward || null,
          deliveryAddress.district || null,
          deliveryAddress.street || null,
          deliveryAddress.houseNumber || null,
          deliveryAddress.buildingName || null,
          deliveryAddress.block || null,
          deliveryAddress.floor || null,
          deliveryAddress.roomNumber || null,
          deliveryAddress.deliveryInstructions || null,
        ];

        db.query(deliveryQuery, deliveryValues, (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error inserting delivery:', err);
              res.status(500).json({ message: 'Server error' });
            });
          }

          // Commit the transaction
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err);
                res.status(500).json({ message: 'Server error' });
              });
            }
            res.status(201).json({ message: 'Order placed successfully', orderId });
          });
        });
      });
    });
  });
});

module.exports = router;