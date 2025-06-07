const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all ingredients
router.get('/ingredients', auth.authenticateToken, async (req, res) => {
  try {
    // Select ingredient_id, ingredient_name, unit, quantity, minimum_threshold from ingredient and supplier_name from supplier
    const [ingredients] = await db.query(
      'SELECT i.ingredient_id, i.ingredient_name, i.unit, i.quantity, i.minimum_threshold, i.good_for, MAX(s.supplier_name) as supplier_name \
       FROM ingredient i \
       LEFT JOIN supplier_product sp ON i.ingredient_id = sp.ingredient_id \
       LEFT JOIN supplier s ON sp.supplier_id = s.supplier_id \
       GROUP BY i.ingredient_id, i.ingredient_name, i.unit, i.quantity, i.minimum_threshold, i.good_for'
    );
    res.json({ success: true, ingredients: ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a new ingredient
router.post('/ingredients', async (req, res) => {
  try {
    const { ingredient_name, quantity, unit, minimum_threshold, supplier_id } = req.body;

    if (!ingredient_name || quantity === undefined || unit === undefined) {
       return res.status(400).json({ error: 'Ingredient name, quantity, and unit are required' });
    }

    // Insert into ingredient table
    const [result] = await db.query(
      'INSERT INTO ingredient (ingredient_name, quantity, unit, minimum_threshold) VALUES (?, ?, ?, ?)',
      [ingredient_name, quantity, unit, minimum_threshold]
    );

    const newIngredientId = result.insertId;

    // If a supplier_id is provided, insert into supplier_product table
    if (supplier_id) {
        await db.query(
            'INSERT INTO supplier_product (ingredient_id, supplier_id) VALUES (?, ?)',
            [newIngredientId, supplier_id]
        );
    }

    res.status(201).json({ message: 'Ingredient added successfully', ingredientId: newIngredientId });

  } catch (error) {
    console.error('Error adding ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an ingredient
router.put('/ingredients/:id', async (req, res) => {
  try {
    const ingredientId = req.params.id;
    const { ingredient_name, quantity, unit, minimum_threshold, supplier_id, good_for } = req.body;

    if (!ingredient_name || quantity === undefined || unit === undefined) {
      return res.status(400).json({ error: 'Ingredient name, quantity, and unit are required' });
    }

    // Update ingredient table
    const [result] = await db.query(
      'UPDATE ingredient SET ingredient_name = ?, quantity = ?, unit = ?, minimum_threshold = ?, good_for = ? WHERE ingredient_id = ?',
      [ingredient_name, quantity, unit, minimum_threshold, good_for, ingredientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    // Handle supplier_product table update (simple approach: delete existing and insert new if supplier_id provided)
    await db.query('DELETE FROM supplier_product WHERE ingredient_id = ?', [ingredientId]);
    if (supplier_id) {
        await db.query(
            'INSERT INTO supplier_product (ingredient_id, supplier_id) VALUES (?, ?)',
            [ingredientId, supplier_id]
        );
    }

    res.json({ message: 'Ingredient updated successfully' });

  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an ingredient
router.delete('/ingredients/:id', async (req, res) => {
  try {
    const ingredientId = req.params.id;

    // TODO: Add checks for foreign key constraints before deleting
    // If an ingredient is part of a recipe (recipe_detail) or restock (restock_detail) or waste (waste_detail), 
    // deleting it directly might cause errors due to foreign key constraints.
    // You might need to decide on a policy: disallow deletion, soft delete, or delete related entries (use with caution!).
    // For now, a simple delete is implemented, which might fail if there are related records.

    // First, delete from supplier_product to avoid foreign key constraint issues
    await db.query('DELETE FROM supplier_product WHERE ingredient_id = ?', [ingredientId]);

    const [result] = await db.query('DELETE FROM ingredient WHERE ingredient_id = ?', [ingredientId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ message: 'Ingredient deleted successfully' });

  } catch (error) {
    console.error('Error deleting ingredient:', error);
    // Check for foreign key constraint errors (less likely now after deleting from supplier_product, but good to keep)
    if (error.code === 'ER_ROW_IS_REFERENCED_' || error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'Cannot delete ingredient because it is referenced by recipes, restock orders, or waste records.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all ingredients and their stock (Existing route, keeping it here)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ingredient ORDER BY ingredient_name');
    res.json({ success: true, ingredients: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to get all waste details
router.get('/waste', auth.authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all waste details for authenticated staff...');
    const [wasteData] = await db.query(`
      SELECT 
        w.waste_id,
        w.waste_date,
        i.ingredient_name,
        wd.quantity as wasted_quantity,
        i.unit
      FROM waste w
      JOIN waste_detail wd ON w.waste_id = wd.waste_id
      JOIN ingredient i ON wd.ingredient_id = i.ingredient_id
      ORDER BY w.waste_date DESC, w.waste_id, i.ingredient_name
    `);
    console.log('Waste details fetched.', wasteData.length);
    res.json({ success: true, waste: wasteData });
  } catch (error) {
    console.error('Error fetching waste details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// New endpoint to get restock details for a specific ingredient
router.get('/ingredients/:ingredientId/restocks', auth.authenticateToken, async (req, res) => {
  try {
    const { ingredientId } = req.params;
    console.log(`Fetching restock details for ingredient ID: ${ingredientId}`);

    // Select restock details and restock date for a specific ingredient
    const [restockDetails] = await db.query(`
      SELECT
        rd.restock_id,
        r.restock_date,
        rd.import_quantity,
        rd.import_price,
        i.unit
      FROM restock_detail rd
      JOIN restock r ON rd.restock_id = r.restock_id
      JOIN ingredient i ON rd.ingredient_id = i.ingredient_id
      WHERE rd.ingredient_id = ?
      ORDER BY r.restock_date DESC
    `, [ingredientId]);

    console.log(`Restock details fetched for ingredient ${ingredientId}:`, restockDetails.length);
    res.json({ success: true, restockDetails: restockDetails });

  } catch (error) {
    console.error(`Error fetching restock details for ingredient ${ingredientId}:`, error);
    res.status(500).json({ success: false, message: 'Error fetching restock details' });
  }
});

module.exports = router; 