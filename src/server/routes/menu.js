const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all recipes (menu items)
router.get('/', (req, res) => {
  const query = `
    SELECT 
      rcp_id,
      rcp_name,
      cost,
      calories,
      protein,
      fat,
      carbohydrate,
      fiber,
      price,
      saturated_fat,
      sugar,
      vitamin_a,
      vitamin_c,
      calcium,
      iron,
      vitamin_d,
      magnesium,
      potassium,
      vitamin_b6,
      vitamin_b12,
      category,
      image_url,
      description
    FROM Recipe
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Get recipe details
router.get('/recipes', (req, res) => {
  const query = `
    SELECT 
      rcp_id,
      rcp_name,
      calories,
      protein,
      fat,
      fiber,
      carbohydrate,
      description
    FROM Recipe
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Transform the results into the desired format
    const recipeDetails = {};
    results.forEach(recipe => {
      recipeDetails[recipe.rcp_id] = {
        name: recipe.rcp_name,
        calories: recipe.calories.toString(),
        protein: recipe.protein.toString(),
        fat: recipe.fat.toString(),
        fiber: recipe.fiber.toString(),
        carb: recipe.carbohydrate.toString(),
        description: recipe.description
      };
    });
    
    res.json(recipeDetails);
  });
});

module.exports = router;