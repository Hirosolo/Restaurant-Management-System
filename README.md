# Restaurant Management System

A full-stack web application for restaurant management, featuring:
- Customer-facing user interface for browsing menu, placing orders, and tracking orders
- Staff interface for managing inventory, recipes, staff, and viewing revenue
- Backend API with authentication, order processing, and database integration

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](https://example.com)

## Features

### User Interface (Customer)
- Browse categorized menu with filters (calories, protein, etc.)
- Add items to cart, checkout as guest or registered user
- Track order status by phone number
- Account management and password reset

### Staff Interface
- Staff authentication and protected dashboard
- Manage recipes, ingredients, and inventory
- View and manage staff accounts
- View revenue and sales statistics
- Restock management and shift scheduling

### Backend
- RESTful API for all business logic
- JWT-based authentication for users and staff
- MySQL database integration
- Order, recipe, ingredient, staff, and sales management

## Installation

### 1. Clone the repository
```
git clone <repo-url>
cd Restaurant-Management-System
```

### 2. Setup the Backend

1. **Install MySQL**  
   Make sure MySQL server is installed and running on your machine.  

   - [Download MySQL](https://dev.mysql.com/downloads/installer/)  

2. **Login as root**  
   ```bash
   mysql -u root -p
   ```

3. **Create a new database and user**  
   Inside the MySQL shell, run:
   ```sql
   CREATE DATABASE restaurant_db;
   CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON restaurant_db.* TO 'restaurant_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Configure environment variables**  
   In `backend/.env`, add your database info:
   ```
   DB_HOST=localhost
   DB_USER=restaurant_user
   DB_PASSWORD=your_password
   DB_NAME=restaurant_db
   DB_PORT=3306
   JWT_SECRET=your_secret_key
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

5. **Install dependencies**  
   ```bash
   cd backend
   npm install
   ```

6. **Initialize the database (migrations + seed)**  
   ```bash
   npm run init-db
   # (Optional) npm run seed-db
   ```

7. **Start the backend server**  
   ```bash
   npm run dev
   ```
   The backend runs on [http://localhost:3001](http://localhost:3001)


### 3. Setup the User Interface (Customer)
1. Go to the project root:
   ```
   cd ..
   npm install
   ```
2. Start the React app:
   ```
   npm start
   ```
   The user interface runs on [http://localhost:3000](http://localhost:3000)

### 4. Setup the Staff Interface
1. Go to the staff interface directory:
   ```
   cd staff-interface
   npm install
   ```
2. Start the staff React app:
   ```
   npm start
   ```
   The staff interface runs on [http://localhost:3002](http://localhost:3002) by default (or the next available port).

## Usage
- Access the customer UI at [http://localhost:3000](http://localhost:3000)
- Access the staff UI at [http://localhost:3002](http://localhost:3002)
- The backend API is available at [http://localhost:3001](http://localhost:3001)

## Environment Variables
See `backend/.env` for backend configuration:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: MySQL connection
- `PORT`: Backend server port (default 3001)
- `JWT_SECRET`: Secret for JWT authentication
- `FRONTEND_URL`: Allowed frontend URL for CORS