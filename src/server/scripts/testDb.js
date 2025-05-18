const db = require('../config/db');

console.log('Testing database connection...');

// Test the connection
db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Database connection test failed:', err);
    process.exit(1);
  }
  console.log('Database connection test successful');

  // Test the ingredients table
  console.log('Testing ingredients table...');
  db.query('SELECT * FROM ingredient', (err, results) => {
    if (err) {
      console.error('Error querying ingredients table:', err);
      process.exit(1);
    }
    console.log('Ingredients table query successful');
    console.log('Number of ingredients found:', results.length);
    console.log('First few ingredients:', results.slice(0, 3));
    process.exit(0);
  });
}); 