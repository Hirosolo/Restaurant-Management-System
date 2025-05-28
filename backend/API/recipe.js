const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all recipes with their categories
router.get('/recipes', async (req, res) => {
    try {
        const [recipes] = await db.query(`
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
            ORDER BY category, recipe_name
        `);

        // Group recipes by category
        const categories = recipes.reduce((acc, recipe) => {
            const category = recipe.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push({
                id: recipe.recipe_id,
                name: recipe.recipe_name,
                price: recipe.price,
                rating: 5, // Default rating since it's not in the schema
                image: recipe.image_url,
                calories: recipe.calories,
                protein: recipe.protein,
                fat: recipe.fat,
                fiber: recipe.fiber,
                carb: recipe.carbohydrate
            });
            return acc;
        }, {});

        // Transform categories object into array format
        const categoriesArray = Object.entries(categories).map(([name, items], index) => ({
            id: index + 1,
            name,
            items
        }));

        res.json(categoriesArray);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recipe details by ID
router.get('/recipes/:id', async (req, res) => {
    try {
        const [recipe] = await db.query(`
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
            WHERE recipe_id = ?
        `, [req.params.id]);

        if (recipe.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(recipe[0]);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 