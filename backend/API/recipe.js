const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path
const fs = require('fs'); // Import fs

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../public/assets');
const tempUploadDir = path.join(uploadDir, 'temp');

// Create upload directories if they don't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir);
}

// Set up multer storage configuration for temporary saving
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempUploadDir); // Save temporarily to the temp directory
    },
    filename: function (req, file, cb) {
        // Use a temporary filename, e.g., fieldname + '-' + Date.now() + extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Create the multer upload instance
const upload = multer({ storage: storage });

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
        const recipeId = req.params.id;
        // Fetch recipe details
        const [recipeRows] = await db.query(`
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
        `, [recipeId]);

        if (recipeRows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const recipe = recipeRows[0];

        // Fetch ingredients for the recipe
        const [ingredientRows] = await db.query(`
            SELECT 
                rd.ingredient_id,
                i.ingredient_name AS ingredient,
                rd.weight AS amount
            FROM recipe_detail rd
            JOIN ingredient i ON rd.ingredient_id = i.ingredient_id
            WHERE rd.recipe_id = ?
        `, [recipeId]);

        // Add ingredients to the recipe object
        recipe.ingredients = ingredientRows;

        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new recipe
router.post('/recipes', upload.single('image'), async (req, res) => { // Use multer middleware here
    let uploadedFilePath = null; // To keep track of the uploaded file for cleanup
    try {
        // req.body will contain the text fields, req.file will contain the file info
        const { recipe_name, category, calories, protein, fat, carbohydrate, fiber, price, ingredients: ingredientsJson, image_url: placeholderImageUrl } = req.body; // Destructure image_url as well
        const imageFile = req.file; // The uploaded image file

        // --- Add validation for essential fields --- 
        if (!recipe_name) {
            console.error('Validation Error: Recipe name is missing.');
            // Clean up any temporarily uploaded file before returning
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                 fs.unlink(uploadedFilePath, (err) => {
                    if (err) console.error('Error deleting temp file after validation error:', err);
                });
            }
            return res.status(400).json({ error: 'Recipe name is required.' });
        }
        // --- End validation --- 

        // Determine the initial image URL
        let initialImageUrl = null;
        if (imageFile) {
            uploadedFilePath = imageFile.path; // Set uploadedFilePath for potential cleanup
            // We will update the image_url after getting the recipeId if a file is uploaded
        } else if (placeholderImageUrl) {
            // Use the placeholder image URL if no file was uploaded
            initialImageUrl = placeholderImageUrl;
        }

        // Parse the ingredients JSON string
        let ingredients = [];
        if (ingredientsJson) {
            try {
                ingredients = JSON.parse(ingredientsJson);
            } catch (parseError) {
                console.error('Error parsing ingredients JSON:', parseError);
                // If ingredients JSON is invalid, remove the uploaded file and send an error
                 if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                    fs.unlink(uploadedFilePath, (err) => {
                        if (err) console.error('Error deleting temp file after JSON parse error:', err);
                    });
                }
                return res.status(400).json({ error: 'Invalid ingredients data format.' });
            }
        }

        // Insert into recipe table first to get the recipe_id
        // Use the determined initialImageUrl
        const [result] = await db.query(
            'INSERT INTO recipe (recipe_name, category, calories, protein, fat, carbohydrate, fiber, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [recipe_name, category, parseFloat(calories) || 0, parseFloat(protein) || 0, parseFloat(fat) || 0, parseFloat(carbohydrate) || 0, parseFloat(fiber) || 0, parseFloat(price) || 0, initialImageUrl] // Use initialImageUrl
        );

        const recipeId = result.insertId;
        let finalImageUrl = initialImageUrl; // Start with initial URL, will update if file uploaded

        // If an image was uploaded, rename it and update the recipe record
        if (imageFile) {
            const fileExtension = path.extname(imageFile.originalname);
            // Format recipeId to be 3 digits
            const formattedRecipeId = String(recipeId).padStart(3, '0');
            const finalFileName = `RCP-${formattedRecipeId}${fileExtension}`;
            const finalFilePath = path.join(uploadDir, finalFileName);
            const relativeImagePath = `/assets/${finalFileName}`; // URL path

            try {
                // Rename (move) the temporary file to the final location and name
                fs.renameSync(uploadedFilePath, finalFilePath); // Use renameSync for simplicity in this context
                finalImageUrl = relativeImagePath; // Store the final URL

                // Update the recipe table with the final image_url
                await db.query(
                    'UPDATE recipe SET image_url = ? WHERE recipe_id = ?',
                    [finalImageUrl, recipeId] // Use finalImageUrl
                );

            } catch (renameError) {
                console.error('Error renaming image file:', renameError);
                 // Clean up the temporarily uploaded file in case of rename error
                 if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                    fs.unlink(uploadedFilePath, (err) => {
                        if (err) console.error('Error deleting temp file after rename error:', err);
                    });
                }
                // Decide how to handle the error: rollback database insert or just log and continue without image?
                // For now, we'll just log and continue, leaving the image_url as null
            }
        }

        // Insert into recipe_detail table
        if (ingredients && ingredients.length > 0) {
             // Ensure ingredients is an array of arrays for the VALUES ? syntax
             const recipeDetailValues = ingredients.map(ingredient => [
                 recipeId,
                 ingredient.ingredient_id,
                 parseFloat(ingredient.weight) || 0 // Ensure weight is a number
            ]);

            // Check if recipeDetailValues is not empty after mapping and filtering
            if (recipeDetailValues.length > 0) {
                await db.query(
                    'INSERT INTO recipe_detail (recipe_id, ingredient_id, weight) VALUES ?',
                    [recipeDetailValues]
                );
            }
        }

        // Respond with success message and the new recipe ID (and maybe the image URL)
        res.status(201).json({ message: 'Recipe added successfully', recipeId, image_url: finalImageUrl });

    } catch (error) {
        console.error('Error adding recipe:', error);

        // Clean up the temporarily uploaded file in case of database errors
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
             fs.unlink(uploadedFilePath, (err) => {
                if (err) console.error('Error deleting temp file after DB error:', err);
            });
        }

        // You might want to add logic here to clean up the recipe record if ingredient insert failed

        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update an existing recipe
router.put('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { recipe_name, category, calories, protein, fat, carbohydrate, fiber, price, image_url, ingredients } = req.body;

        // Update recipe table
        await db.query(
            'UPDATE recipe SET recipe_name = ?, category = ?, calories = ?, protein = ?, fat = ?, carbohydrate = ?, fiber = ?, price = ?, image_url = ? WHERE recipe_id = ?',
            [recipe_name, category, calories, protein, fat, carbohydrate, fiber, price, image_url, recipeId]
        );

        // Update recipe_detail table: Delete existing and insert new ones
        await db.query('DELETE FROM recipe_detail WHERE recipe_id = ?', [recipeId]);
        if (ingredients && ingredients.length > 0) {
            const recipeDetailValues = ingredients.map(ingredient => [recipeId, ingredient.ingredient_id, ingredient.weight]);
            await db.query(
                'INSERT INTO recipe_detail (recipe_id, ingredient_id, weight) VALUES ?',
                [recipeDetailValues]
            );
        }

        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a recipe
router.delete('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Optional: Get the image_url before deleting the recipe to delete the image file as well
        const [recipeRows] = await db.query('SELECT image_url FROM recipe WHERE recipe_id = ?', [recipeId]);
        const imageUrl = recipeRows.length > 0 ? recipeRows[0].image_url : null;

        // Delete from order_detail table first to avoid foreign key constraint
        await db.query('DELETE FROM order_detail WHERE recipe_id = ?', [recipeId]);

        // Delete from recipe_detail table
        await db.query('DELETE FROM recipe_detail WHERE recipe_id = ?', [recipeId]);

        // Delete from recipe table
        const [result] = await db.query('DELETE FROM recipe WHERE recipe_id = ?', [recipeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

         // If an image was associated, try to delete the image file
         if (imageUrl && imageUrl.startsWith('/assets/')) {
            const imagePath = path.join(__dirname, '../../public', imageUrl); // Construct absolute path
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image file:', imagePath, err);
            });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 