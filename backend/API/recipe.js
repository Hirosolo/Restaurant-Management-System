const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all recipes with their categories
router.get('/recipes', async (req, res) => {
    try {
        const { calories, protein } = req.query;
        let query = `
            SELECT DISTINCT
                r.recipe_id,
                r.recipe_name,
                r.category,
                r.calories,
                r.protein,
                r.fat,
                r.carbohydrate,
                r.fiber,
                r.price,
                r.image_url
            FROM recipe r
            LEFT JOIN recipe_detail rd ON r.recipe_id = rd.recipe_id
            LEFT JOIN ingredient i ON rd.ingredient_id = i.ingredient_id
            WHERE 1=1
        `;
        const params = [];

        // Apply calories filter
        if (calories) {
            switch (calories) {
                case '< 300':
                    query += ' AND r.calories < 300';
                    break;
                case '300 - 500':
                    query += ' AND r.calories >= 300 AND r.calories <= 500';
                    break;
                case '> 500':
                    query += ' AND r.calories > 500';
                    break;
            }
        }

        // Apply protein filter
        if (protein) {
            // Map the filter options to actual ingredient names in the database
            const proteinMap = {
                'Salmon': 'Salmon Fillet',
                'Tuna': 'Cans tuna',
                'Chicken': ['Chicken Breast Fillet', 'Chicken Thigh'],
                'Shrimp': 'Shrimp',
                'Scallop': 'Scallop',
                'Tofu': 'Tofu'
            };
            
            const ingredientNames = proteinMap[protein];
            if (Array.isArray(ingredientNames)) {
                // For chicken, we need to check both breast and thigh
                query += ' AND (i.ingredient_name = ? OR i.ingredient_name = ?)';
                params.push(ingredientNames[0], ingredientNames[1]);
            } else {
                query += ' AND i.ingredient_name = ?';
                params.push(ingredientNames);
            }
        }

        query += ' ORDER BY r.category, r.recipe_name';

        const [recipes] = await db.query(query, params);

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