DROP DATABASE restaurant_db;

CREATE DATABASE restaurant_db;

USE restaurant_db;

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    phone VARCHAR(10),
    password VARCHAR(100),
    loyalty_point FLOAT,
    email VARCHAR(100)
);

CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role ENUM('Manager', 'Chef', 'Order Staff', 'Kitchen Supervisor', 'Shipper') NOT NULL,
    phone VARCHAR(10),
    pay_rate INT
);

CREATE TABLE schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    shift_date DATETIME NOT NULL,
    shift ENUM('Morning', 'Evening') NOT NULL,
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100),
    category ENUM('Main Dishes', 'Side Dishes', 'Salads', 'Pasta & Noodles', 'Rice Dishes', 'Soup'),
    calories FLOAT,
    protein FLOAT,
    fat FLOAT,
    carbohydrate FLOAT,
    fiber FLOAT,
    price FLOAT,
    img_url TEXT
);

CREATE TABLE ingredient (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100),
    quantity FLOAT,
    unit VARCHAR(20),
    minimum_threshold FLOAT
);

CREATE TABLE recipe_detail (
    recipe_id INT,
    ingredient_id INT,
    weight FLOAT,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE sale (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount FLOAT,
    payment_method ENUM('Cash', 'Online Transfer'),
    completion_time DATETIME,
    status VARCHAR(20) DEFAULT 'Pending',
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE order_detail (
    sale_id INT,
    recipe_id INT,
    quantity INT,
    FOREIGN KEY (sale_id) REFERENCES sale(sale_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);

CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT,
    content TEXT,
    feedback_date DATETIME,
    customer_id INT,
    sale_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (sale_id) REFERENCES sale(sale_id)
);

CREATE TABLE waste (
    waste_id INT AUTO_INCREMENT PRIMARY KEY,
    waste_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE waste_detail (
    waste_id INT,
    ingredient_id INT,
    quantity FLOAT,
    reason TEXT,
    FOREIGN KEY (waste_id) REFERENCES waste(waste_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100),
    phone VARCHAR(10),
    address TEXT
);

CREATE TABLE supplier_product (
    ingredient_id INT,
    supplier_id INT,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE restock (
    restock_id INT AUTO_INCREMENT PRIMARY KEY,
    restock_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE restock_detail (
    restock_id INT,
    ingredient_id INT,
    import_quantity FLOAT,
    import_price FLOAT,
    FOREIGN KEY (restock_id) REFERENCES restock(restock_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);
