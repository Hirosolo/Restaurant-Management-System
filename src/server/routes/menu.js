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
    console.log('Recipes fetched successfully');
    res.json(results);
  });
});

// Get all ingredients
router.get('/ingredients', (req, res) => {
  console.log('Fetching ingredients from database...');
  const query = `
    SELECT 
      ing_id,
      ing_name,
      quantity,
      unit,
      cost_per_unit,
      expiration_duration,
      minimum_threshold
    FROM ingredient
  `;

  console.log('Executing query:', query);
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    console.log('Ingredients fetched successfully:', results);
    if (!Array.isArray(results)) {
      console.error('Query results is not an array:', results);
      return res.status(500).json({ message: 'Invalid data format' });
    }
    res.json(results);
  });
});

// Create new recipe
router.post('/recipes', (req, res) => {
  const { recipe, ingredients } = req.body;
  
  console.log('Received recipe data:', recipe);
  console.log('Received ingredients:', ingredients);

  if (!recipe || !ingredients) {
    return res.status(400).json({ message: 'Recipe and ingredients data are required' });
  }

  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    // Insert into Recipe table
    const recipeQuery = `
      INSERT INTO Recipe (
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
        description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const recipeValues = [
      recipe.rcp_name,
      recipe.cost || 0,
      recipe.calories || 0,
      recipe.protein || 0,
      recipe.fat || 0,
      recipe.carbohydrate || 0,
      recipe.fiber || 0,
      recipe.price || 0,
      recipe.saturated_fat || 0,
      recipe.sugar || 0,
      recipe.vitamin_a || 0,
      recipe.vitamin_c || 0,
      recipe.calcium || 0,
      recipe.iron || 0,
      recipe.vitamin_d || 0,
      recipe.magnesium || 0,
      recipe.potassium || 0,
      recipe.vitamin_b6 || 0,
      recipe.vitamin_b12 || 0,
      recipe.category || '',
      recipe.description || ''
    ];

    console.log('Recipe query:', recipeQuery);
    console.log('Recipe values:', recipeValues);

    db.query(recipeQuery, recipeValues, (err, result) => {
      if (err) {
        console.error('Error inserting recipe:', err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error creating recipe', error: err.message });
        });
      }

      const recipeId = result.insertId;
      console.log('Recipe created with ID:', recipeId);

      // Insert into recipe_detail table
      if (ingredients && ingredients.length > 0) {
        const detailQuery = `
          INSERT INTO recipe_detail (rcp_id, ing_id, weight)
          VALUES ?
        `;

        const detailValues = ingredients.map(ing => [
          recipeId,
          ing.ing_id,
          ing.weight || 0
        ]);

        console.log('Inserting recipe details with query:', detailQuery);
        console.log('Recipe details values:', detailValues);

        db.query(detailQuery, [detailValues], (err) => {
          if (err) {
            console.error('Error inserting recipe details:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error adding ingredients', error: err.message });
            });
          }

          console.log('Successfully inserted recipe details');

          // Commit the transaction
          db.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Error saving recipe', error: err.message });
              });
            }
            res.status(201).json({ message: 'Recipe created successfully', recipeId });
          });
        });
      } else {
        console.log('No ingredients provided for recipe');
        // If no ingredients, just commit the transaction
        db.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error saving recipe', error: err.message });
            });
          }
          res.status(201).json({ message: 'Recipe created successfully', recipeId });
        });
      }
    });
  });
});

// Get recipe details
router.get('/recipes', (req, res) => {
  console.log('Fetching all recipes...');
  const query = `
    SELECT 
      rcp_id,
      rcp_name,
      calories,
      protein,
      fat,
      fiber,
      carbohydrate,
      description,
      category,
      price
    FROM Recipe
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    console.log('Raw recipe results:', results);
    
    // Transform the results into the desired format
    const recipeDetails = {};
    results.forEach(recipe => {
      console.log('Processing recipe:', recipe);
      recipeDetails[recipe.rcp_id] = {
        id: recipe.rcp_id,
        name: recipe.rcp_name,
        calories: recipe.calories.toString(),
        protein: recipe.protein.toString(),
        fat: recipe.fat.toString(),
        fiber: recipe.fiber.toString(),
        carb: recipe.carbohydrate.toString(),
        description: recipe.description,
        category: recipe.category,
        price: recipe.price
      };
    });
    
    console.log('Transformed recipe details:', recipeDetails);
    res.json(recipeDetails);
  });
});

// Delete recipe
router.delete('/recipes/:id', (req, res) => {
  const recipeId = parseInt(req.params.id);
  console.log('Delete request received for recipe ID:', recipeId);
  console.log('Raw ID from params:', req.params.id);

  if (isNaN(recipeId)) {
    console.error('Invalid recipe ID provided:', req.params.id);
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  // First check if the recipe exists
  const checkQuery = 'SELECT * FROM Recipe WHERE rcp_id = ?';
  console.log('Executing check query with ID:', recipeId);
  
  db.query(checkQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error checking recipe existence:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    console.log('Recipe check results:', results);

    if (results.length === 0) {
      // Try to find the recipe with a different ID format
      const alternativeCheckQuery = 'SELECT * FROM Recipe WHERE rcp_id = ? OR rcp_id = ?';
      const alternativeId = recipeId.toString().padStart(3, '0');
      console.log('Trying alternative ID format:', alternativeId);
      
      db.query(alternativeCheckQuery, [recipeId, alternativeId], (err, altResults) => {
        if (err) {
          console.error('Error checking alternative ID:', err);
          return res.status(500).json({ message: 'Server error', error: err.message });
        }

        console.log('Alternative check results:', altResults);

        if (altResults.length === 0) {
          console.log('Recipe not found with any ID format');
          return res.status(404).json({ message: 'Recipe not found' });
        }

        // Use the found recipe's ID
        const foundId = altResults[0].rcp_id;
        console.log('Found recipe with ID:', foundId);
        proceedWithDeletion(foundId);
      });
    } else {
      proceedWithDeletion(recipeId);
    }
  });

  function proceedWithDeletion(id) {
    // Start a transaction
    db.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }

      // First delete from recipe_detail table
      const deleteDetailsQuery = 'DELETE FROM recipe_detail WHERE rcp_id = ?';
      console.log('Executing delete details query with ID:', id);
      db.query(deleteDetailsQuery, [id], (err, result) => {
        if (err) {
          console.error('Error deleting recipe details:', err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error deleting recipe details', error: err.message });
          });
        }
        console.log('Deleted recipe details:', result.affectedRows, 'rows affected');

        // Then delete from Recipe table
        const deleteRecipeQuery = 'DELETE FROM Recipe WHERE rcp_id = ?';
        console.log('Executing delete recipe query with ID:', id);
        db.query(deleteRecipeQuery, [id], (err, result) => {
          if (err) {
            console.error('Error deleting recipe:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error deleting recipe', error: err.message });
            });
          }

          if (result.affectedRows === 0) {
            console.log('No recipe found with ID:', id);
            return db.rollback(() => {
              res.status(404).json({ message: 'Recipe not found' });
            });
          }
          console.log('Deleted recipe:', result.affectedRows, 'rows affected');

          // Commit the transaction
          db.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Error saving changes', error: err.message });
              });
            }
            console.log('Successfully deleted recipe with ID:', id);
            res.json({ message: 'Recipe deleted successfully' });
          });
        });
      });
    });
  }
});

// Get recipe ingredients
router.get('/recipes/:id/ingredients', (req, res) => {
  const recipeId = parseInt(req.params.id);
  console.log('Fetching ingredients for recipe ID:', recipeId);
  console.log('Raw ID from params:', req.params.id);

  if (isNaN(recipeId)) {
    console.error('Invalid recipe ID:', req.params.id);
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  // First check if the recipe exists
  const checkQuery = 'SELECT * FROM Recipe WHERE rcp_id = ?';
  console.log('Checking if recipe exists with query:', checkQuery, 'and ID:', recipeId);
  
  db.query(checkQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error checking recipe existence:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    console.log('Recipe check results:', results);

    if (results.length === 0) {
      console.log('Recipe not found with ID:', recipeId);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // If recipe exists, fetch its ingredients
    const ingredientsQuery = `
      SELECT 
        rd.ing_id,
        i.ing_name,
        rd.weight
      FROM recipe_detail rd
      JOIN ingredient i ON rd.ing_id = i.ing_id
      WHERE rd.rcp_id = ?
    `;

    console.log('Executing ingredients query:', ingredientsQuery, 'with ID:', recipeId);

    db.query(ingredientsQuery, [recipeId], (err, results) => {
      if (err) {
        console.error('Error fetching recipe ingredients:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }

      console.log('Ingredients query results:', results);

      if (!Array.isArray(results)) {
        console.error('Invalid results format:', results);
        return res.status(500).json({ message: 'Invalid data format received from database' });
      }

      // Ensure all required fields are present
      const formattedResults = results.map(ing => ({
        ing_id: ing.ing_id,
        ing_name: ing.ing_name,
        weight: ing.weight || 0
      }));

      console.log('Formatted ingredients results:', formattedResults);
      res.json(formattedResults);
    });
  });
});

// Update recipe
router.put('/recipes/:id', (req, res) => {
  const recipeId = parseInt(req.params.id);
  const { recipe, ingredients } = req.body;
  
  console.log('Updating recipe with ID:', recipeId);
  console.log('Received recipe data:', recipe);
  console.log('Received ingredients:', ingredients);

  if (!recipe || !ingredients) {
    return res.status(400).json({ message: 'Recipe and ingredients data are required' });
  }

  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    // Update Recipe table
    const recipeQuery = `
      UPDATE Recipe SET
        rcp_name = ?,
        cost = ?,
        calories = ?,
        protein = ?,
        fat = ?,
        carbohydrate = ?,
        fiber = ?,
        price = ?,
        saturated_fat = ?,
        sugar = ?,
        vitamin_a = ?,
        vitamin_c = ?,
        calcium = ?,
        iron = ?,
        vitamin_d = ?,
        magnesium = ?,
        potassium = ?,
        vitamin_b6 = ?,
        vitamin_b12 = ?,
        category = ?,
        description = ?
      WHERE rcp_id = ?
    `;

    const recipeValues = [
      recipe.rcp_name,
      recipe.cost || 0,
      recipe.calories || 0,
      recipe.protein || 0,
      recipe.fat || 0,
      recipe.carbohydrate || 0,
      recipe.fiber || 0,
      recipe.price || 0,
      recipe.saturated_fat || 0,
      recipe.sugar || 0,
      recipe.vitamin_a || 0,
      recipe.vitamin_c || 0,
      recipe.calcium || 0,
      recipe.iron || 0,
      recipe.vitamin_d || 0,
      recipe.magnesium || 0,
      recipe.potassium || 0,
      recipe.vitamin_b6 || 0,
      recipe.vitamin_b12 || 0,
      recipe.category || '',
      recipe.description || '',
      recipeId
    ];

    console.log('Recipe update query:', recipeQuery);
    console.log('Recipe values:', recipeValues);

    db.query(recipeQuery, recipeValues, (err, result) => {
      if (err) {
        console.error('Error updating recipe:', err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error updating recipe', error: err.message });
        });
      }

      if (result.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: 'Recipe not found' });
        });
      }

      // Delete existing recipe details
      const deleteDetailsQuery = 'DELETE FROM recipe_detail WHERE rcp_id = ?';
      db.query(deleteDetailsQuery, [recipeId], (err) => {
        if (err) {
          console.error('Error deleting existing recipe details:', err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error updating ingredients', error: err.message });
          });
        }

        // Insert new recipe details
        if (ingredients && ingredients.length > 0) {
          const detailQuery = `
            INSERT INTO recipe_detail (rcp_id, ing_id, weight)
            VALUES ?
          `;

          const detailValues = ingredients.map(ing => [
            recipeId,
            ing.ing_id,
            ing.weight || 0
          ]);

          console.log('Detail query:', detailQuery);
          console.log('Detail values:', detailValues);

          db.query(detailQuery, [detailValues], (err) => {
            if (err) {
              console.error('Error inserting recipe details:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Error updating ingredients', error: err.message });
              });
            }

            // Commit the transaction
            db.commit(err => {
              if (err) {
                console.error('Error committing transaction:', err);
                return db.rollback(() => {
                  res.status(500).json({ message: 'Error saving changes', error: err.message });
                });
              }
              res.json({ message: 'Recipe updated successfully' });
            });
          });
        } else {
          // If no ingredients, just commit the transaction
          db.commit(err => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Error saving changes', error: err.message });
              });
            }
            res.json({ message: 'Recipe updated successfully' });
          });
        }
      });
    });
  });
});

module.exports = router;