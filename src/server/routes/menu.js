const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Log all requests to menu routes
router.use((req, res, next) => {
  console.log(`Menu route accessed: ${req.method} ${req.path}`);
  next();
});

// Get all recipes (menu items)
router.get('/', (req, res) => {
  console.log('Fetching all recipes...');
  const query = `
    SELECT 
      recipe_id,
      recipe_name,
      category,
      calories,
      protein,
      fat,
      carbohydrate,
      fiber,
      price,
      image_url
    FROM recipe
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    console.log('Recipes fetched successfully');
    res.json(results);
  });
});

// Get all ingredients
router.get('/ingredients', (req, res) => {
  console.log('Fetching ingredients from database...');
  const query = `
    SELECT 
      ingredient_id,
      ingredient_name,
      quantity,
      unit,
      minimum_threshold
    FROM ingredient
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    res.json(results);
  });
});

// Create new recipe
router.post('/recipes', (req, res) => {
  const { recipe, ingredients } = req.body;
  if (!recipe || !ingredients) {
    return res.status(400).json({ message: 'Recipe and ingredients data are required' });
  }
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    const recipeQuery = `
      INSERT INTO recipe (
        recipe_name,
        category,
        calories,
        protein,
        fat,
        carbohydrate,
        fiber,
        price,
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const recipeValues = [
      recipe.recipe_name,
      recipe.category,
      recipe.calories || 0,
      recipe.protein || 0,
      recipe.fat || 0,
      recipe.carbohydrate || 0,
      recipe.fiber || 0,
      recipe.price || 0,
      recipe.image_url || null
    ];
    db.query(recipeQuery, recipeValues, (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ message: 'Error creating recipe', error: err.message }));
      const recipeId = result.insertId;
      if (ingredients && ingredients.length > 0) {
        const detailQuery = `INSERT INTO recipe_detail (recipe_id, ingredient_id, weight) VALUES ?`;
        const detailValues = ingredients.map(ing => [recipeId, ing.ingredient_id, ing.weight || 0]);
        db.query(detailQuery, [detailValues], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ message: 'Error adding ingredients', error: err.message }));
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ message: 'Error saving recipe', error: err.message }));
            res.status(201).json({ message: 'Recipe created successfully', recipeId });
          });
        });
      } else {
        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ message: 'Error saving recipe', error: err.message }));
          res.status(201).json({ message: 'Recipe created successfully', recipeId });
        });
      }
    });
  });
});

// Get recipe details
router.get('/recipes', (req, res) => {
  const query = `
    SELECT 
      recipe_id,
      recipe_name,
      category,
      calories,
      protein,
      fat,
      carbohydrate,
      fiber,
      price,
      image_url
    FROM recipe
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    const recipeDetails = {};
    results.forEach(recipe => {
      recipeDetails[recipe.recipe_id] = {
        id: recipe.recipe_id,
        name: recipe.recipe_name,
        category: recipe.category,
        calories: recipe.calories,
        protein: recipe.protein,
        fat: recipe.fat,
        carbohydrate: recipe.carbohydrate,
        fiber: recipe.fiber,
        price: recipe.price,
        image_url: recipe.image_url
      };
    });
    res.json(recipeDetails);
  });
});

// Delete recipe
router.delete('/recipes/:id', (req, res) => {
  const recipeId = parseInt(req.params.id);
  if (isNaN(recipeId)) return res.status(400).json({ message: 'Invalid recipe ID' });
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    db.query('DELETE FROM recipe_detail WHERE recipe_id = ?', [recipeId], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ message: 'Error deleting recipe details', error: err.message }));
      db.query('DELETE FROM recipe WHERE recipe_id = ?', [recipeId], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ message: 'Error deleting recipe', error: err.message }));
        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ message: 'Error saving changes', error: err.message }));
          res.json({ message: 'Recipe deleted successfully' });
        });
      });
    });
  });
});

// Get recipe ingredients
router.get('/recipes/:id/ingredients', (req, res) => {
  const recipeId = parseInt(req.params.id);
  if (isNaN(recipeId)) return res.status(400).json({ message: 'Invalid recipe ID' });
  const ingredientsQuery = `
    SELECT 
      rd.ingredient_id,
      i.ingredient_name,
      rd.weight
    FROM recipe_detail rd
    JOIN ingredient i ON rd.ingredient_id = i.ingredient_id
    WHERE rd.recipe_id = ?
  `;
  db.query(ingredientsQuery, [recipeId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    const formattedResults = results.map(ing => ({
      ingredient_id: ing.ingredient_id,
      ingredient_name: ing.ingredient_name,
      weight: ing.weight || 0
    }));
    res.json(formattedResults);
  });
});

// Update recipe
router.put('/recipes/:id', (req, res) => {
  const recipeId = parseInt(req.params.id);
  const { recipe, ingredients } = req.body;
  if (!recipe || !ingredients) return res.status(400).json({ message: 'Recipe and ingredients data are required' });
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    const recipeQuery = `
      UPDATE recipe SET
        recipe_name = ?,
        category = ?,
        calories = ?,
        protein = ?,
        fat = ?,
        carbohydrate = ?,
        fiber = ?,
        price = ?,
        image_url = ?
      WHERE recipe_id = ?
    `;
    const recipeValues = [
      recipe.recipe_name,
      recipe.category,
      recipe.calories || 0,
      recipe.protein || 0,
      recipe.fat || 0,
      recipe.carbohydrate || 0,
      recipe.fiber || 0,
      recipe.price || 0,
      recipe.image_url || null,
      recipeId
    ];
    db.query(recipeQuery, recipeValues, (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ message: 'Error updating recipe', error: err.message }));
      db.query('DELETE FROM recipe_detail WHERE recipe_id = ?', [recipeId], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ message: 'Error updating ingredients', error: err.message }));
        if (ingredients && ingredients.length > 0) {
          const detailQuery = `INSERT INTO recipe_detail (recipe_id, ingredient_id, weight) VALUES ?`;
          const detailValues = ingredients.map(ing => [recipeId, ing.ingredient_id, ing.weight || 0]);
          db.query(detailQuery, [detailValues], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ message: 'Error updating ingredients', error: err.message }));
            db.commit(err => {
              if (err) return db.rollback(() => res.status(500).json({ message: 'Error saving changes', error: err.message }));
              res.json({ message: 'Recipe updated successfully' });
            });
          });
        } else {
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ message: 'Error saving changes', error: err.message }));
            res.json({ message: 'Recipe updated successfully' });
          });
        }
      });
    });
  });
});

module.exports = router;