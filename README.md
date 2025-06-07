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
1. Configure your MySQL database and update credentials in `backend/.env`.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Initialize the database (run migrations and seed data as needed):
   ```
   npm run init-db
   # (Optional) npm run seed-db
   ```
4. Start the backend server:
   ```
   npm run dev
   # or
   npm start
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