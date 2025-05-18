const db = require('../config/db');

db.query('SELECT * FROM ingredient', (err, results) => {
  if (err) {
    console.error('Error fetching ingredients:', err);
    process.exit(1);
  }
  console.log('Ingredients in database:', results);
  process.exit(0);
}); 