CREATE DATABASE restaurant_db;

USE restaurant_db;

CREATE TABLE customer(
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    phone VARCHAR(10),
    password VARCHAR(100),
    loyalty_point FLOAT,
    email TEXT,
    address TEXT
);

CREATE TABLE staff(
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    staff_email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('Manager','Chef','Order Staff','Kitchen Supervisor','Shipper') NOT NULL,
    phone VARCHAR(10),
    pay_rates FLOAT
);

CREATE TABLE schedule(
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    shift_date DATETIME NOT NULL,
    shift ENUM ('Morning', 'Evening') NOT NULL,
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE recipe(
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100),
    category ENUM('Main Dishes', 'Side Dishes', 'Salads', 'Pasta & Noodles', 'Rice Dishes', 'Soup'),
    calories FLOAT,
    protein FLOAT,
    fat FLOAT,
    carbohydrate FLOAT,
    fiber FLOAT,
    price FLOAT,
    image_url TEXT
);

CREATE TABLE ingredient(
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100),
    quantity FLOAT,
    unit VARCHAR(20),
    minimum_threshold FLOAT,
    good_for INT
);

CREATE TABLE recipe_detail(
    recipe_id INT,
    ingredient_id INT,
    weight FLOAT,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE sale (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount FLOAT,
    payment_method ENUM('cash', 'momo', 'vietcombank'),
    completion_time DATETIME,
    status VARCHAR(20) DEFAULT 'Pending',
    customer_id INT,
    delivery_address TEXT,
    delivery_distance FLOAT,
    delivery_charge FLOAT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE order_detail(
    sale_id INT,
    recipe_id INT,
    quantity INT,
    PRIMARY KEY (sale_id, recipe_id),
    FOREIGN KEY (sale_id) REFERENCES sale(sale_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);

CREATE TABLE feedback(
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT,
    content TEXT, 
    feedback_date DATETIME, 
    customer_id INT,
    sale_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (sale_id) REFERENCES sale(sale_id)
);

CREATE TABLE waste(
    waste_id INT AUTO_INCREMENT PRIMARY KEY,
    waste_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE waste_detail(
    waste_id INT,
    ingredient_id INT,
    quantity FLOAT,
    reason TEXT,
    PRIMARY KEY (waste_id, ingredient_id),
    FOREIGN KEY (waste_id) REFERENCES waste(waste_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE supplier(
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100),
    phone VARCHAR(10),
    address TEXT
);

CREATE TABLE supplier_product(
    ingredient_id INT,
    supplier_id INT,
    PRIMARY KEY (ingredient_id, supplier_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE restock(
    restock_id INT AUTO_INCREMENT PRIMARY KEY,
    restock_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE restock_detail(
    restock_id INT,
    ingredient_id INT,
    import_quantity FLOAT,
    import_price FLOAT,
    PRIMARY KEY (restock_id, ingredient_id),
    FOREIGN KEY (restock_id) REFERENCES restock(restock_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE revenue (
    revenue_id INT AUTO_INCREMENT PRIMARY KEY,
    date_recorded DATE,
    daily_revenue FLOAT DEFAULT 0,
    UNIQUE KEY idx_date (date_recorded)
);

DELIMITER //

CREATE TRIGGER trg_update_ingredient_quantity_on_restock
AFTER INSERT ON restock_detail
FOR EACH ROW
BEGIN
    UPDATE ingredient
    SET quantity = quantity + NEW.import_quantity
    WHERE ingredient_id = NEW.ingredient_id;
END//

CREATE TRIGGER trg_deduct_ingredients_after_payment
AFTER UPDATE ON sale
FOR EACH ROW
BEGIN
    IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
        UPDATE ingredient i
        JOIN recipe_detail rd ON i.ingredient_id = rd.ingredient_id
        JOIN order_detail od ON rd.recipe_id = od.recipe_id
        SET i.quantity = i.quantity - (rd.weight * od.quantity)
        WHERE od.sale_id = NEW.sale_id;
    END IF;
END//

CREATE TRIGGER trg_update_revenue_after_payment
AFTER UPDATE ON sale
FOR EACH ROW
BEGIN
    IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
        INSERT INTO revenue (date_recorded, daily_revenue)
        VALUES (DATE(NEW.completion_time), NEW.total_amount)
        ON DUPLICATE KEY UPDATE
        daily_revenue = daily_revenue + NEW.total_amount;
    END IF;
END//

DELIMITER ;