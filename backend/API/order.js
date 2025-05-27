const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Create a new order
router.post('/create', async (req, res) => {
  const { items, delivery_address, delivery_distance, delivery_charge, customer_id } = req.body;
  let connection;
  
  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Insert into sale table
    const [saleResult] = await connection.query(
      `INSERT INTO sale (
        total_amount, 
        payment_method, 
        status, 
        customer_id, 
        delivery_address, 
        delivery_distance, 
        delivery_charge
      ) VALUES (?, ?, 'Pending', ?, ?, ?, ?)`,
      [
        totalAmount,
        'Online Transfer',
        customer_id || null, // Allow null for guest orders
        delivery_address,
        delivery_distance,
        delivery_charge
      ]
    );

    const saleId = saleResult.insertId;

    // Insert order details
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_detail (sale_id, recipe_id, quantity) VALUES (?, ?, ?)`,
        [saleId, item.id, item.quantity]
      );
    }

    // Commit transaction
    await connection.commit();

    res.json({
      success: true,
      message: 'Order created successfully',
      orderId: saleId
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

// Get order details
router.get('/:orderId', auth.authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  
  try {
    // Get order details with items
    const [orderDetails] = await db.query(
      `SELECT 
        s.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'recipe_id', rd.recipe_id,
            'recipe_name', r.recipe_name,
            'quantity', rd.quantity,
            'price', r.price,
            'image_url', r.image_url
          )
        ) as items
      FROM sale s
      LEFT JOIN order_detail rd ON s.sale_id = rd.sale_id
      LEFT JOIN recipe r ON rd.recipe_id = r.recipe_id
      WHERE s.sale_id = ?
      GROUP BY s.sale_id`,
      [orderId]
    );

    if (orderDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Parse items JSON string to array
    const order = {
      ...orderDetails[0],
      items: JSON.parse(`[${orderDetails[0].items}]`)
    };

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

module.exports = router; 