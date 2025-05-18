const db = require('../config/db');

const sampleIngredients = [
  {
    ing_name: 'Chicken Breast',
    quantity: 1000,
    unit: 'g',
    cost_per_unit: 5.99,
    expiration_duration: 7,
    minimum_threshold: 500
  },
  {
    ing_name: 'Rice',
    quantity: 2000,
    unit: 'g',
    cost_per_unit: 2.99,
    expiration_duration: 365,
    minimum_threshold: 1000
  },
  {
    ing_name: 'Olive Oil',
    quantity: 500,
    unit: 'ml',
    cost_per_unit: 8.99,
    expiration_duration: 180,
    minimum_threshold: 200
  },
  {
    ing_name: 'Salt',
    quantity: 1000,
    unit: 'g',
    cost_per_unit: 1.99,
    expiration_duration: 365,
    minimum_threshold: 500
  },
  {
    ing_name: 'Black Pepper',
    quantity: 200,
    unit: 'g',
    cost_per_unit: 3.99,
    expiration_duration: 365,
    minimum_threshold: 100
  },
  {
    ing_name: 'Garlic',
    quantity: 500,
    unit: 'g',
    cost_per_unit: 2.99,
    expiration_duration: 30,
    minimum_threshold: 200
  },
  {
    ing_name: 'Onion',
    quantity: 1000,
    unit: 'g',
    cost_per_unit: 1.99,
    expiration_duration: 30,
    minimum_threshold: 500
  },
  {
    ing_name: 'Tomato',
    quantity: 1000,
    unit: 'g',
    cost_per_unit: 2.99,
    expiration_duration: 7,
    minimum_threshold: 500
  },
  {
    ing_name: 'Potato',
    quantity: 2000,
    unit: 'g',
    cost_per_unit: 1.99,
    expiration_duration: 30,
    minimum_threshold: 1000
  },
  {
    ing_name: 'Carrot',
    quantity: 1000,
    unit: 'g',
    cost_per_unit: 1.99,
    expiration_duration: 14,
    minimum_threshold: 500
  }
];

// First, check if the ingredient table exists
db.query(`
  CREATE TABLE IF NOT EXISTS ingredient (
    ing_id INT PRIMARY KEY AUTO_INCREMENT,
    ing_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    expiration_duration INT NOT NULL,
    minimum_threshold DECIMAL(10,2) NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Error creating ingredient table:', err);
    process.exit(1);
  }
  console.log('Ingredient table created or already exists');

  // Check if the table is empty
  db.query('SELECT COUNT(*) as count FROM ingredient', (err, results) => {
    if (err) {
      console.error('Error checking ingredient count:', err);
      process.exit(1);
    }

    if (results[0].count === 0) {
      // Insert sample ingredients
      const query = 'INSERT INTO ingredient (ing_name, quantity, unit, cost_per_unit, expiration_duration, minimum_threshold) VALUES ?';
      const values = sampleIngredients.map(ing => [
        ing.ing_name,
        ing.quantity,
        ing.unit,
        ing.cost_per_unit,
        ing.expiration_duration,
        ing.minimum_threshold
      ]);

      db.query(query, [values], (err) => {
        if (err) {
          console.error('Error inserting sample ingredients:', err);
          process.exit(1);
        }
        console.log('Sample ingredients added successfully');
        process.exit(0);
      });
    } else {
      console.log('Ingredient table already has data');
      process.exit(0);
    }
  });
}); 