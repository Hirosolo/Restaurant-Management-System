const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth'); // Assuming auth middleware is needed for staff endpoints

// Get all restock orders (summary) or daily import totals by month/year
router.get('/restocks', auth.authenticateToken, async (req, res) => { // Add auth middleware
  try {
    const { month, year } = req.query; // Get month and year from query parameters

    if (month && year) {
      // Fetch daily import totals for the specified month and year
      const [dailyTotals] = await db.query(`
        SELECT
          DAY(r.restock_date) as day,
          SUM(rd.import_quantity * rd.import_price) as total_import_price
        FROM restock r
        JOIN restock_detail rd ON r.restock_id = rd.restock_id
        WHERE MONTH(r.restock_date) = ? AND YEAR(r.restock_date) = ?
        GROUP BY DAY(r.restock_date)
        ORDER BY DAY(r.restock_date)
      `, [month, year]);

      res.json({ success: true, dailyImportTotals: dailyTotals });

    } else {
      // Get all restock orders (summary) - Existing functionality
      const [restocks] = await db.query(`
        SELECT
          r.restock_id,
          r.restock_date,
          s.supplier_name
        FROM restock r
        JOIN supplier s ON r.supplier_id = s.supplier_id
        ORDER BY r.restock_date DESC
      `);
      res.json({ success: true, restocks: restocks }); // Wrap existing response in success object
    }
  } catch (error) {
    console.error('Error fetching restock data:', error); // Update error message
    res.status(500).json({ success: false, message: 'Internal server error' }); // Wrap error response
  }
});

// Get details for a specific restock order
router.get('/restocks/:id', auth.authenticateToken, async (req, res) => { // Add auth middleware
  try {
    // Join with the restock table to get the restock_date
    const [restockDetails] = await db.query(`
      SELECT
        rd.ingredient_id,
        i.ingredient_name,
        rd.import_quantity,
        rd.import_price,
        i.unit,
        r.restock_date
      FROM restock_detail rd
      JOIN ingredient i ON rd.ingredient_id = i.ingredient_id
      JOIN restock r ON rd.restock_id = r.restock_id
      WHERE rd.restock_id = ?
    `, [req.params.id]);

    if (restockDetails.length === 0) {
      return res.status(404).json({ success: false, message: 'Restock details not found' }); // Wrap response
    }

    res.json({ success: true, restockDetails: restockDetails }); // Wrap response
  } catch (error) {
    console.error('Error fetching restock details:', error); // Update error message
    res.status(500).json({ success: false, message: 'Internal server error' }); // Wrap error response
  }
});

// Create a new restock order with details
router.post('/restocks', async (req, res) => { // Public endpoint, no auth middleware
  let connection;
  try {
    const { supplier_id, restock_date, items } = req.body;

    if (supplier_id == null || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid restock data provided' }); // Wrap response
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insert into restock table
    const [restockResult] = await connection.query(
      'INSERT INTO restock (supplier_id, restock_date) VALUES (?, ?)',
      [supplier_id, restock_date || new Date()]
    );

    const restockId = restockResult.insertId;

    // Insert into restock_detail table
    const restockDetailValues = items.map(item => [
      restockId,
      item.ingredient_id,
      item.import_quantity,
      item.import_price
    ]);

    await connection.query(
      'INSERT INTO restock_detail (restock_id, ingredient_id, import_quantity, import_price) VALUES ?',
      [restockDetailValues]
    );

    await connection.commit();

    res.status(201).json({ success: true, message: 'Restock order created successfully', restockId }); // Wrap response

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating restock order:', error); // Update error message
    res.status(500).json({ success: false, message: 'Internal server error' }); // Wrap error response
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router; 