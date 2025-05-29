const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Create payment
router.post('/create', auth.authenticateToken, async (req, res) => {
  const { orderId, paymentMethod } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Get order details
    const [orders] = await connection.query(
      'SELECT * FROM sale WHERE sale_id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      throw new Error('Order not found');
    }

    const order = orders[0];
    const orderInfo = `Payment for order #${orderId}`;

    let paymentData;
    if (paymentMethod === 'momo') {
      paymentData = await paymentService.createMoMoPayment(
        orderId,
        order.total_amount,
        orderInfo
      );
    } else if (paymentMethod === 'vietcombank') {
      paymentData = await paymentService.createVietcombankPayment(
        orderId,
        order.total_amount,
        orderInfo
      );
    } else {
      throw new Error('Invalid payment method');
    }

    // Update order with payment information
    await connection.query(
      'UPDATE sale SET payment_method = ?, payment_status = ? WHERE sale_id = ?',
      [paymentMethod, 'Pending', orderId]
    );

    await connection.commit();

    res.json({
      success: true,
      paymentUrl: paymentData.payUrl || paymentData.redirectUrl
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// MoMo payment callback
router.post('/momo/callback', async (req, res) => {
  const data = req.body;
  let connection;

  try {
    // Verify signature
    if (!paymentService.verifyMoMoCallback(data)) {
      throw new Error('Invalid signature');
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Update order status based on payment result
    const paymentStatus = data.resultCode === '0' ? 'Paid' : 'Failed';
    await connection.query(
      'UPDATE sale SET payment_status = ?, payment_transaction_id = ? WHERE sale_id = ?',
      [paymentStatus, data.transId, data.orderId]
    );

    await connection.commit();

    // Return success response to MoMo
    res.json({
      resultCode: '0',
      message: 'Success'
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('MoMo callback error:', error);
    res.status(500).json({
      resultCode: '1',
      message: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Vietcombank payment callback
router.post('/vietcombank/callback', async (req, res) => {
  const data = req.body;
  let connection;

  try {
    // Verify signature
    if (!paymentService.verifyVietcombankCallback(data)) {
      throw new Error('Invalid signature');
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Update order status based on payment result
    const paymentStatus = data.status === 'success' ? 'Paid' : 'Failed';
    await connection.query(
      'UPDATE sale SET payment_status = ?, payment_transaction_id = ? WHERE sale_id = ?',
      [paymentStatus, data.transactionId, data.orderId]
    );

    await connection.commit();

    // Return success response to Vietcombank
    res.json({
      status: 'success',
      message: 'Payment processed successfully'
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Vietcombank callback error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router; 