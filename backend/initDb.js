const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    // First connect without database to create it if it doesn't exist
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'RMS',
      password: process.env.DB_PASSWORD || 't123',
      port: process.env.DB_PORT || 3306,
      connectTimeout: 10000, // 10 seconds
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    console.log('Attempting to connect to MySQL with config:', {
      ...connectionConfig,
      password: '****' // Hide password in logs
    });

    try {
      connection = await mysql.createConnection(connectionConfig);
      console.log('Successfully connected to MySQL server');
    } catch (connError) {
      console.error('Failed to connect to MySQL server:', {
        code: connError.code,
        errno: connError.errno,
        sqlState: connError.sqlState,
        sqlMessage: connError.sqlMessage
      });
      throw connError;
    }

    // Create database if it doesn't exist
    try {
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'restaurant_db'}`);
      console.log('Database created or already exists');
    } catch (dbError) {
      console.error('Failed to create database:', {
        code: dbError.code,
        errno: dbError.errno,
        sqlState: dbError.sqlState,
        sqlMessage: dbError.sqlMessage
      });
      throw dbError;
    }

    // Close the initial connection
    await connection.end();

    // Connect to the specific database
    try {
      connection = await mysql.createConnection({
        ...connectionConfig,
        database: process.env.DB_NAME || 'restaurant_db'
      });
      console.log('Connected to database successfully');
    } catch (dbConnError) {
      console.error('Failed to connect to database:', {
        code: dbConnError.code,
        errno: dbConnError.errno,
        sqlState: dbConnError.sqlState,
        sqlMessage: dbConnError.sqlMessage
      });
      throw dbConnError;
    }

    // Check if recipe table has data
    try {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM recipe');
      const count = rows[0].count;
      console.log(`Found ${count} recipes in the database`);

      if (count === 0) {
        console.log('Database is empty. Seeding data...');
        
        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');
        
        // Split into individual statements and filter out empty ones
        const schemaStatements = schemaSql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => {
            // Filter out empty statements and database-related statements
            return stmt.length > 0 && 
                   !stmt.toLowerCase().includes('create database') && 
                   !stmt.toLowerCase().includes('use') &&
                   !stmt.toLowerCase().includes('restaurant_db');
          });
        
        // Execute each statement
        for (const statement of schemaStatements) {
          try {
            await connection.execute(statement);
          } catch (err) {
            // Skip if table already exists
            if (err.code === 'ER_TABLE_EXISTS_ERROR') {
              console.log('Table already exists, skipping...');
              continue;
            }
            console.error('Error executing schema statement:', err);
            console.error('Problematic statement:', statement);
            throw err;
          }
        }
        console.log('Schema created successfully');

        // Read and execute seedData.sql
        const seedPath = path.join(__dirname, 'config', 'seedData.sql');
        const seedSql = await fs.readFile(seedPath, 'utf8');
        
        // Split into individual statements and filter out empty ones
        const seedStatements = seedSql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => {
            // Filter out empty statements and database-related statements
            return stmt.length > 0 && 
                   !stmt.toLowerCase().includes('use') &&
                   !stmt.toLowerCase().includes('restaurant_db');
          });
        
        // Execute each statement
        for (const statement of seedStatements) {
          try {
            await connection.execute(statement);
          } catch (err) {
            console.error('Error executing seed statement:', err);
            console.error('Problematic statement:', statement);
            // Continue with next statement even if one fails
            continue;
          }
        }
        console.log('Seed data inserted successfully');
      } else {
        console.log('Database already contains data. Skipping seeding.');
      }
    } catch (queryError) {
      console.error('Error checking/creating tables:', {
        code: queryError.code,
        errno: queryError.errno,
        sqlState: queryError.sqlState,
        sqlMessage: queryError.sqlMessage
      });
      throw queryError;
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    if (error.code === 'ETIMEDOUT') {
      console.error('\nConnection timeout. Please check:');
      console.error('1. Is MySQL server running?');
      console.error('2. Are the connection details correct in .env file?');
      console.error('3. Is the port accessible?');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. Please check:');
      console.error('1. Is the username correct?');
      console.error('2. Is the password correct?');
      console.error('3. Does the user have the necessary permissions?');
    }
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed');
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
  }); 