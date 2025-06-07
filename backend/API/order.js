const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Temporary test route
router.get('/test', (req, res) => {
  console.log('Test route in order.js hit!');
  res.send('Order router test successful!');
});

// Get all revenue records
router.get('/revenue', auth.authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all revenue records for authenticated staff...');
    const [rows] = await db.query('SELECT * FROM revenue ORDER BY date_recorded DESC');
    console.log('Revenue records fetched.', rows.length);
    res.json({ success: true, revenue: rows });
  } catch (error) {
    console.error('Error fetching revenue records:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new order for guest users
router.post('/create-guest', async (req, res) => {
  const { 
    items, 
    delivery_address, 
    delivery_distance, 
    delivery_charge, 
    payment_method,
    status,
    guest_contact
  } = req.body;
  let connection;
  
  console.log('Received guest order data:', req.body);
  
  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    // Create a temporary customer record for the guest user
    // Check if a guest customer with this phone number already exists
    const [existingGuest] = await connection.query(
      'SELECT customer_id FROM customer WHERE phone = ? AND customer_name LIKE "Guest_%"',
      [guest_contact]
    );

    let customerId;
    
    if (existingGuest.length > 0) {
      // Use existing guest customer
      customerId = existingGuest[0].customer_id;
      console.log('Using existing guest customer ID:', customerId);
    } else {
      // Create new guest customer
      const guestName = `Guest_${guest_contact}`;
      const [customerResult] = await connection.query(
        `INSERT INTO customer (customer_name, phone, password, loyalty_point, email, address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          guestName,
          guest_contact,
          'guest_password', // Placeholder password
          0, // Start with 0 loyalty points
          `guest_${guest_contact}@temp.com`, // Temporary email
          delivery_address
        ]
      );
      
      customerId = customerResult.insertId;
      console.log('Created new guest customer with ID:', customerId);
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Convert payment method to match ENUM values
    const normalizedPaymentMethod = payment_method === 'momo wallet' ? 'momo' : payment_method;

    console.log('Inserting guest order into sale:', {
        totalAmount,
        payment_method: normalizedPaymentMethod || 'cash',
        status: 'Pending',
        customer_id: customerId,
        delivery_address,
        delivery_distance,
        delivery_charge
    });

    // Insert into sale table with the guest customer_id
    const [saleResult] = await connection.query(
      `INSERT INTO sale (
        total_amount, 
        payment_method, 
        status,
        customer_id, 
        delivery_address, 
        delivery_distance, 
        delivery_charge,
        completion_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)` ,
      [
        totalAmount,
        normalizedPaymentMethod || 'cash',
        'Pending',
        customerId,
        delivery_address,
        delivery_distance,
        delivery_charge
      ]
    );

    const saleId = saleResult.insertId;
    console.log('Guest sale inserted with ID:', saleId);

    // Insert order details
    for (const item of items) {
      console.log('Inserting order detail:', { saleId, recipeId: item.id, quantity: item.quantity });
      await connection.query(
        `INSERT INTO order_detail (sale_id, recipe_id, quantity) VALUES (?, ?, ?)`,
        [saleId, item.id, item.quantity]
      );
    }
    console.log('Order details inserted.');

    // Update ingredient quantities if order is completed
    if (status === 'Completed') {
      for (const item of items) {
        const [ingredients] = await connection.query(
          `SELECT rd.ingredient_id, rd.weight 
           FROM recipe_detail rd 
           WHERE rd.recipe_id = ?`,
          [item.id]
        );

        for (const ingredient of ingredients) {
          await connection.query(
            `UPDATE ingredient 
             SET quantity = quantity - ? 
             WHERE ingredient_id = ?`,
            [ingredient.weight * item.quantity, ingredient.ingredient_id]
          );
        }
      }
    }

    // Commit transaction
    await connection.commit();
    console.log('Guest order transaction committed successfully.');

    res.json({
      success: true,
      message: 'Guest order created successfully',
      orderId: saleId,
      customerId: customerId
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      connection.rollback();
      console.error('Transaction rolled back due to error:', error);
    }
    console.error('Error creating guest order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating guest order',
      error: error.message
    });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
  }
});

// Create a new order
router.post('/create', auth.authenticateCustomerToken, async (req, res) => {
  const { 
    items, 
    delivery_address, 
    delivery_distance, 
    delivery_charge, 
    payment_method,
    status,
    loyalty_points_used,
    loyalty_points_earned
  } = req.body;
  let connection;
  
  console.log('Received order data:', req.body);
  
  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Convert payment method to match ENUM values
    const normalizedPaymentMethod = payment_method === 'momo wallet' ? 'momo' : payment_method;

    console.log('Inserting into sale:', {
        totalAmount,
        payment_method: normalizedPaymentMethod || 'cash',
        status: 'Pending',
        customer_id: req.user.customer_id,
        delivery_address,
        delivery_distance,
        delivery_charge
    });

    // Insert into sale table
    const [saleResult] = await connection.query(
      `INSERT INTO sale (
        total_amount, 
        payment_method, 
        status,
        customer_id, 
        delivery_address, 
        delivery_distance, 
        delivery_charge,
        completion_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)` ,
      [
        totalAmount,
        normalizedPaymentMethod || 'cash',
        'Pending',
        req.user.customer_id,
        delivery_address,
        delivery_distance,
        delivery_charge
      ]
    );

    const saleId = saleResult.insertId;
    console.log('Sale inserted with ID:', saleId);

    // Insert order details
    for (const item of items) {
      console.log('Inserting order detail:', { saleId, recipeId: item.id, quantity: item.quantity });
      await connection.query(
        `INSERT INTO order_detail (sale_id, recipe_id, quantity) VALUES (?, ?, ?)`,
        [saleId, item.id, item.quantity]
      );
    }
    console.log('Order details inserted.');

    // Update ingredient quantities if order is completed
    if (status === 'Completed') {
      for (const item of items) {
        const [ingredients] = await connection.query(
          `SELECT rd.ingredient_id, rd.weight 
           FROM recipe_detail rd 
           WHERE rd.recipe_id = ?`,
          [item.id]
        );

        for (const ingredient of ingredients) {
          await connection.query(
            `UPDATE ingredient 
             SET quantity = quantity - ? 
             WHERE ingredient_id = ?`,
            [ingredient.weight * item.quantity, ingredient.ingredient_id]
          );
        }
      }
    }

    // Update user's loyalty points if customer_id is present
    if (req.user.customer_id) {
      let loyaltyPointsAdjustment = -loyalty_points_used; // Subtract used points
      
      // Add earned points only if the order status is 'Completed'
      if (status === 'Completed') {
        loyaltyPointsAdjustment += loyalty_points_earned;
      }
      
      console.log('Updating loyalty points for customer:', {
          customerId: req.user.customer_id,
          adjustment: loyaltyPointsAdjustment,
          orderStatus: status
      });

      await connection.query(
        `UPDATE customer SET loyalty_point = loyalty_point + ? WHERE customer_id = ?`,
        [loyaltyPointsAdjustment, req.user.customer_id]
      );
      console.log('Loyalty points updated.');
    }

    // Commit transaction
    await connection.commit();
    console.log('Transaction committed successfully.');

    res.json({
      success: true,
      message: 'Order created successfully',
      orderId: saleId
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      connection.rollback();
      console.error('Transaction rolled back due to error:', error);
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
      console.log('Database connection released.');
    }
  }
});

// Get user's order history
router.get('/user/orders', auth.authenticateCustomerToken, async (req, res) => {
  try {
    // Get all orders for the user with their items
    const [orders] = await db.query(
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
      WHERE s.customer_id = ?
      GROUP BY s.sale_id
      ORDER BY s.sale_time DESC`,
      [req.user.customer_id]
    );

    // Parse items JSON string to array for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(`[${order.items}]`)
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order history',
      error: error.message
    });
  }
});

// Get user's frequently ordered meals
router.get('/user/favorite-meals', auth.authenticateCustomerToken, async (req, res) => {
  try {
    // Get all orders for the user and count recipe occurrences
    const [favoriteMeals] = await db.query(
      `SELECT 
        r.recipe_id,
        r.recipe_name,
        r.price,
        r.image_url,
        SUM(rd.quantity) as total_ordered,
        COUNT(DISTINCT s.sale_id) as times_ordered
      FROM sale s
      JOIN order_detail rd ON s.sale_id = rd.sale_id
      JOIN recipe r ON rd.recipe_id = r.recipe_id
      WHERE s.customer_id = ?
      GROUP BY r.recipe_id, r.recipe_name, r.price, r.image_url
      ORDER BY total_ordered DESC`,
      [req.user.customer_id]
    );

    res.json({
      success: true,
      favoriteMeals
    });

  } catch (error) {
    console.error('Error fetching favorite meals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite meals',
      error: error.message
    });
  }
});

// Get all orders for staff dashboard
router.get('/all', auth.authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all orders for staff dashboard...'); // Add log
    const [orders] = await db.query(`
      SELECT 
        s.sale_id as order_id,
        s.sale_time as time,
        s.status,
        s.delivery_address,
        c.customer_name,
        c.phone,
        GROUP_CONCAT(
          JSON_OBJECT(
            'recipe_name', r.recipe_name,
            'quantity', od.quantity
          )
        ) as order_details
      FROM sale s
      JOIN customer c ON s.customer_id = c.customer_id
      JOIN order_detail od ON s.sale_id = od.sale_id
      JOIN recipe r ON od.recipe_id = r.recipe_id
      GROUP BY s.sale_id, s.sale_time, s.status, s.delivery_address, c.customer_name
      ORDER BY s.sale_time DESC
    `);
    console.log('All orders fetched.', orders.length);

    // Parse order_details JSON string to array for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      order_details: JSON.parse(`[${order.order_details}]`)
    }));

    res.json({ success: true, orders: formattedOrders });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching all orders' });
  }
});

// Get details for a specific order
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

// Add an endpoint to mark an order as completed
router.put('/complete/:orderId', auth.authenticateCustomerToken, async (req, res) => {
  const { orderId } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    // First verify that the order belongs to the customer
    const [order] = await connection.query(
      'SELECT * FROM sale WHERE sale_id = ? AND customer_id = ?',
      [orderId, req.user.customer_id]
    );

    if (order.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
    }

    // Calculate loyalty points (1 point per 1000 VND)
    const loyaltyPointsEarned = Math.floor(order[0].total_amount / 1000);

    // Set status to Completed and completion_time to NOW()
    const [result] = await connection.query(
      `UPDATE sale SET status = 'Completed', completion_time = NOW() WHERE sale_id = ?`,
      [orderId]
    );

    // Update customer's loyalty points
    await connection.query(
      `UPDATE customer SET loyalty_point = loyalty_point + ? WHERE customer_id = ?`,
      [loyaltyPointsEarned, req.user.customer_id]
    );

    await connection.commit();
    res.json({ 
      success: true, 
      message: 'Order marked as completed.',
      loyaltyPointsEarned
    });
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Get guest order history by phone number
router.get('/guest/orders/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    console.log('Fetching guest orders for phone:', phone);
    
    // Get all orders for guest customers with this phone number
    const [orders] = await db.query(
      `SELECT 
        s.*,
        c.customer_name,
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
      JOIN customer c ON s.customer_id = c.customer_id
      LEFT JOIN order_detail rd ON s.sale_id = rd.sale_id
      LEFT JOIN recipe r ON rd.recipe_id = r.recipe_id
      WHERE c.phone = ? AND c.customer_name LIKE 'Guest_%'
      GROUP BY s.sale_id
      ORDER BY s.sale_time DESC`,
      [phone]
    );

    // Parse items JSON string to array for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching guest order history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order history',
      error: error.message
    });
  }
});

// Get all ingredients and their stock
router.get('/ingredients', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ingredient ORDER BY ingredient_name');
    res.json({ success: true, ingredients: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;