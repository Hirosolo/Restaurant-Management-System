USE restaurant_db;

-- Insert into ingredient (from Ingredients.csv)
INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit, minimum_threshold, good_for) VALUES
(1, 'Salmon Fillet', 0, 'kg', 2, 3),
(2, 'Chicken Breast Fillet', 0, 'kg', 5, 7),
(3, 'Tofu', 0, 'piece', 10, 14),
(4, 'Salt', 0, 'kg', 0.5, 365),
(5, 'Sugar', 0, 'kg', 0.5, 365),
(6, 'Honey', 0, 'liter', 0.5, 365),
(7, 'Parmesan', 0, 'kg', 1, 180),
(8, 'Panko', 0, 'kg', 1, 365),
(9, 'Paprika', 0, 'kg', 0.2, 365),
(10, 'Onion powder', 0, 'kg', 0.2, 365),
(11, 'Garlic powder', 0, 'kg', 0.2, 365),
(12, 'Oregano', 0, 'kg', 0.2, 365),
(13, 'Butter', 0, 'kg', 1, 30),
(14, 'Olive oil', 0, 'liter', 1, 365),
(15, 'Lemon', 0, 'kg', 10, 30),
(16, 'Parsley', 0, 'kg', 0.2, 7),
(17, 'Mayonnaise', 0, 'kg', 1, 180),
(18, 'Bun', 0, 'piece', 50, 7),
(19, 'Tomato', 0, 'kg', 3, 14),
(20, 'Lettuce', 0, 'kg', 3, 3),
(21, 'Onion', 0, 'kg', 3, 30),
(22, 'Chili sauce', 0, 'kg', 1, 365),
(23, 'Tomato sauce', 0, 'liter', 1, 365),
(24, 'Cans tuna', 0, 'can', 10, 365),
(25, 'Eggs', 0, 'piece', 50, 30),
(26, 'Shrimp', 0, 'kg', 2, 7),
(27, 'Bell pepper', 0, 'kg', 2, 14),
(28, 'Hoisin sauce', 0, 'liter', 1, 365),
(29, 'Soy sauce', 0, 'liter', 1, 365),
(30, 'Vinegar', 0, 'liter', 1, 365),
(31, 'Cornstarch', 0, 'kg', 1, 365),
(32, 'Ginger', 0, 'kg', 0.5, 30),
(33, 'Spring onion', 0, 'kg', 1, 7),
(34, 'Carrot', 0, 'kg', 3, 30),
(35, 'Eggplant', 0, 'kg', 2, 14),
(36, 'Basil', 0, 'kg', 0.5, 7),
(37, 'Mozzarella', 0, 'kg', 1, 30),
(38, 'Heavy cream', 0, 'liter', 1, 14),
(39, 'Milk', 0, 'liter', 2, 14),
(40, 'Cucumber', 0, 'kg', 1, 14),
(41, 'Avocado', 0, 'kg', 1, 7),
(42, 'Spaghetti noodles', 0, 'kg', 2, 365),
(43, 'Penne', 0, 'kg', 2, 365),
(44, 'All-purpose flour', 0, 'kg', 5, 365),
(45, 'Scallop', 0, 'kg', 1, 7),
(46, 'Cabbage', 0, 'kg', 2, 30),
(47, 'Rice', 0, 'kg', 10, 365),
(48, 'Pea', 0, 'kg', 1, 180),
(49, 'Fish sauce', 0, 'liter', 1, 365),
(50, 'Kidney bean', 0, 'kg', 1, 365),
(51, 'Navy bean', 0, 'kg', 1, 365),
(52, 'Mushroom', 0, 'kg', 1, 7),
(53, 'Spinach', 0, 'kg', 1, 3),
(54, 'Chicken Thigh', 0, 'kg', 2, 7),
(55, 'Garlic', 0, 'kg', 0.5, 30),
(56, 'Pecan', 0, 'kg', 0.5, 365),
(57, 'Pepper', 0, 'kg', 0.5, 365);

-- Insert into supplier (from Supplier.csv)
INSERT INTO supplier (supplier_id, supplier_name, phone, address) VALUES
(1, 'Co.opmart', '903332211', '199-205 Nguyen Thai Hoc, District 1, HCMC, Vietnam'),
(2, 'CP Foods Vietnam', '912223344', '88 Le Van Thiem, Tan Phong Ward, District 7, HCMC, Vietnam'),
(3, 'MeatDeli', '925556677', '55 Truong Dinh, Ben Thanh Ward, District 1, HCMC, Vietnam'),
(4, 'Vissan', '934447788', '420 Nguyen Thi Minh Khai, District 3, HCMC, Vietnam'),
(5, 'San Ha Foods', '907778899', '150 Nguyen Van Cu, District 5, HCMC, Vietnam'),
(6, 'Ba Huan Eggs', '918889900', '72 Vo Thi Sau, Tan Dinh Ward, District 1, HCMC, Vietnam'),
(7, 'TH True Milk', '921110011', '33 Pham Ngoc Thach, District 3, HCMC, Vietnam'),
(8, 'Vinamilk', '936668899', '10 Tan Trao, Tan Phu Ward, District 7, HCMC, Vietnam'),
(9, 'Saigon Food Co.', '909997766', '44 Ly Tu Trong, Ben Nghe Ward, District 1, HCMC, Vietnam'),
(10, 'Cj Foods Vietnam', '914445533', '120 Tran Quang Khai, Tan Dinh Ward, District 1, HCMC, Vietnam'),
(11, 'Bach Hoa Xanh', '283812596', '117 Cong Quynh, District 1, Ho Chi Minh City, Vietnam'),
(12, 'Big C', '283858585', '199-205 Nguyen Thai Hoc, District 1, Ho Chi Minh City, Vietnam'),
(13, 'Lotte Mart', '283775111', '469 Nguyen Huu Tho, District 7, Ho Chi Minh City, Vietnam');

-- Insert into supplier_product (from Supplier_Product.csv)
INSERT INTO supplier_product (ingredient_id, supplier_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (13, 1), (14, 1),
(15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1), (21, 1), (22, 1), (23, 1), (24, 1),
(25, 1), (26, 1), (27, 1), (28, 1), (29, 1), (30, 1), (37, 1), (39, 1), (42, 1), (43, 1),
(44, 1), (2, 2), (26, 2), (45, 2), (54, 2), (2, 3), (54, 3), (2, 4), (54, 4), (2, 5), (26, 5),
(54, 5), (25, 6), (38, 7), (39, 7), (7, 8), (37, 8), (38, 8), (39, 8), (1, 9), (26, 9), (45, 9),
(4, 10), (5, 10), (9, 10), (10, 10), (11, 10), (12, 10), (29, 10), (31, 10), (49, 10), (2, 11),
(3, 11), (4, 11), (5, 11), (13, 11), (15, 11), (16, 11), (19, 11), (20, 11), (21, 11), (25, 11),
(26, 11), (27, 11), (32, 11), (33, 11), (34, 11), (39, 11), (46, 11), (35, 11), (36, 11), (40, 11),
(41, 11), (45, 11), (52, 11), (53, 11), (1, 12), (2, 12), (3, 12), (4, 12), (5, 12), (6, 12), (7, 12),
(8, 12), (13, 12), (14, 12), (15, 12), (17, 12), (18, 12), (19, 12), (20, 12), (21, 12), (22, 12),
(23, 12), (24, 12), (25, 12), (26, 12), (27, 12), (28, 12), (29, 12), (30, 12), (37, 12), (39, 12),
(42, 12), (43, 12), (44, 12), (35, 12), (36, 12), (40, 12), (41, 12), (46, 12), (52, 12), (53, 12),
(1, 13), (2, 13), (3, 13), (4, 13), (5, 13), (6, 13), (7, 13), (8, 13), (13, 13), (14, 13), (15, 13),
(17, 13), (18, 13), (19, 13), (20, 13), (21, 13), (22, 13), (23, 13), (24, 13), (25, 13), (26, 13),
(27, 13), (28, 13), (29, 13), (30, 13), (37, 13), (39, 13), (42, 13), (43, 13), (44, 13), (35, 13),
(36, 13), (40, 13), (41, 13), (46, 13), (52, 13), (53, 13), (32, 1), (33, 1), (34, 1), (35, 1), (36, 1),
(40, 1), (41, 1), (45, 1), (46, 1), (52, 1), (53, 1), (47, 10), (48, 10), (50, 10), (51, 10), (47, 1),
(48, 1), (49, 1), (50, 1), (51, 1), (47, 12), (48, 12), (49, 12), (50, 12), (51, 12), (47, 13), (48, 13),
(49, 13), (50, 13), (51, 13), (9, 1), (10, 1), (11, 1), (12, 1), (31, 1), (9, 12), (10, 12), (11, 12),
(12, 12), (31, 12), (9, 13), (10, 13), (11, 13), (12, 13), (31, 13), (55, 1), (56, 1), (57, 1), (55, 12),
(56, 12), (57, 12), (55, 13), (56, 13), (57, 13);

-- Insert into recipe (from recipe.csv, with calculated prices)
INSERT INTO recipe (recipe_id, recipe_name, category, calories, protein, fat, carbohydrate, fiber, price, image_url) VALUES
(1, 'Pecan Crusted Salmon', 'Main Dishes', 488, 54.4, 22.4, 18.6, 3.4, 165000, '/assets/RCP-001.jpg'),
(2, 'Blackened Salmon', 'Main Dishes', 468, 50.6, 30.4, 0, 0, 159000, '/assets/RCP-002.jpg'),
(3, 'Salmon Burger', 'Main Dishes', 694, 56.6, 37.2, 30.6, 2.6, 171000, '/assets/RCP-003.jpg'),
(4, 'Tuna Cakes', 'Main Dishes', 368, 31.2, 18.8, 15.2, 1, 65000, '/assets/RCP-004.jpg'),
(5, 'Cajun Grilled Shrimp', 'Main Dishes', 252, 45.6, 8.2, 0, 0, 83000, '/assets/RCP-005.jpg'),
(6, 'Lettuce Wrap', 'Side Dishes', 456, 25.4, 28.6, 29, 10, 25000, '/assets/RCP-006.jpg'),
(7, 'Eggplant Parmigiana', 'Side Dishes', 375, 26.8, 12.4, 41.2, 8.2, 58000, '/assets/RCP-007.jpg'),
(8, 'Chicken Meatballs', 'Main Dishes', 684, 56.6, 35.6, 35.2, 3.6, 51000, '/assets/RCP-008.jpg'),
(9, 'Smoked Salmon Salad', 'Salads', 454, 37.6, 33, 4.1, 3.6, 82000, '/assets/RCP-009.jpg'),
(10, 'Lemon Garlic Chicken', 'Main Dishes', 648, 55.2, 42.4, 12.8, 1.8, 52000, '/assets/RCP-010.jpg'),
(11, 'Pan Seared Chicken Breast', 'Main Dishes', 398, 51.2, 20, 1.2, 0.4, 34000, '/assets/RCP-011.jpg'),
(12, 'Baked Chicken Thighs', 'Main Dishes', 376, 59.2, 12.6, 3.8, 0.9, 35000, '/assets/RCP-012.jpg'),
(13, 'Chicken Nuggets', 'Side Dishes', 630, 65, 20.8, 0, 3.2, 41000, '/assets/RCP-013.jpg'),
(14, 'Honey Garlic Chicken Thighs', 'Main Dishes', 297, 31.4, 34.4, 44.4, 1, 46000, '/assets/RCP-014.jpg'),
(15, 'Chicken Caesar Salad', 'Salads', 401, 33.1, 22.8, 15.4, 2.1, 34000, '/assets/RCP-015.jpg'),
(16, 'Grilled Chicken Salad', 'Salads', 459, 34.5, 28, 19.3, 3.6, 39000, '/assets/RCP-016.jpg'),
(17, 'Garlic Butter Noodles', 'Pasta & Noodles', 338, 9.6, 13.8, 43.8, 2.1, 21000, '/assets/RCP-017.jpg'),
(18, 'Cajun Shrimp Pasta', 'Pasta & Noodles', 563, 44.6, 21.8, 47.6, 3.4, 42000, '/assets/RCP-018.jpg'),
(19, 'Pasta Pomodoro', 'Pasta & Noodles', 465, 14.1, 17.7, 66.4, 8.4, 27000, '/assets/RCP-019.jpg'),
(20, 'Creamy Shrimp Pasta', 'Pasta & Noodles', 555, 32.9, 26.8, 44.9, 1.9, 39000, '/assets/RCP-020.jpg'),
(21, 'Scallop Pasta with Lemon & Herbs', 'Pasta & Noodles', 463, 22.4, 20, 47.7, 2, 39000, '/assets/RCP-021.jpg'),
(22, 'Tofu Fried Rice', 'Rice Dishes', 520, 17.7, 23.3, 61.6, 5.6, 25000, '/assets/RCP-022.jpg'),
(23, 'Breaded Tofu Burger', 'Main Dishes', 373, 12.4, 13.6, 44.8, 4, 23000, '/assets/RCP-023.jpg'),
(24, 'Tofu Salad', 'Salads', 221, 13.1, 14.3, 13.1, 7.8, 19000, '/assets/RCP-024.jpg'),
(25, 'Shrimp Fried Rice', 'Rice Dishes', 719, 40.1, 23.3, 88.9, 5.4, 40000, '/assets/RCP-025.jpg'),
(26, 'Shrimp Burger', 'Main Dishes', 262, 36.5, 12.1, 40, 1.3, 35000, '/assets/RCP-026.jpg'),
(27, 'Pan Seared Scallops', 'Main Dishes', 328, 27.4, 20.8, 7.2, 0, 52000, '/assets/RCP-027.jpg'),
(28, 'Classic Bean Soup', 'Soup', 299, 16.1, 9.3, 45, 7.3, 25000, '/assets/RCP-028.jpg'),
(29, 'Tofu Soup with Spinach', 'Soup', 232, 16.5, 9.9, 22.6, 7.2, 23000, '/assets/RCP-029.jpg'),
(30, 'Carrot Soup', 'Soup', 209, 3.2, 11.5, 25.7, 5.2, 18000, '/assets/RCP-030.jpg'),
(31, 'Classic Tomato Soup', 'Soup', 178, 2.7, 13.4, 14.9, 3.7, 17000, '/assets/RCP-031.jpg'),
(32, 'Garlic Butter Salmon', 'Main Dishes', 474, 51.2, 29.2, 3.4, 0.4, 135000, '/assets/RCP-032.jpg');

-- Insert into recipe_detail (from recipe_detail.csv)
INSERT INTO recipe_detail (recipe_id, ingredient_id, weight) VALUES
(1, 1, 0.25), (1, 4, 0.0025), (1, 6, 0.025), (1, 7, 0.005), (1, 8, 0.0075), (1, 9, 0.015), (1, 57, 0.0025),
(2, 1, 0.25), (2, 4, 0.0035), (2, 9, 0.005), (2, 10, 0.0025), (2, 11, 0.0025), (2, 12, 0.0015), (2, 13, 0.007), (2, 14, 0.0175), (2, 15, 0.05), (2, 57, 0.001),
(3, 1, 0.25), (3, 4, 0.0025), (3, 8, 0.025), (3, 10, 0.0005), (3, 14, 0.0075), (3, 16, 0.0125), (3, 17, 0.015), (3, 18, 1), (3, 19, 0.05), (3, 20, 0.025), (3, 21, 0.025),
(4, 4, 0.0025), (4, 8, 0.02), (4, 11, 0.001), (4, 14, 0.015), (4, 16, 0.005), (4, 17, 0.015), (4, 24, 1), (4, 25, 1), (4, 33, 0.01),
(5, 4, 0.00025), (5, 9, 0.002), (5, 10, 0.00075), (5, 11, 0.001), (5, 12, 0.0005), (5, 14, 0.01), (5, 15, 0.05), (5, 26, 0.25), (5, 57, 0.00025),
(6, 3, 2), (6, 14, 0.00375), (6, 20, 0.125), (6, 28, 0.03), (6, 29, 0.01125), (6, 30, 0.01125), (6, 31, 0.002), (6, 32, 0.003), (6, 33, 0.0225), (6, 34, 0.1),
(7, 4, 0.00175), (7, 7, 0.018), (7, 8, 0.01), (7, 12, 0.0005), (7, 14, 0.005), (7, 25, 0.5), (7, 35, 0.15), (7, 36, 0.0033), (7, 37, 0.0378), (7, 44, 0.016),
(8, 2, 0.25), (8, 4, 0.003), (8, 7, 0.025), (8, 8, 0.0225), (8, 9, 0.00075), (8, 10, 0.00075), (8, 12, 0.0005), (8, 14, 0.0075), (8, 16, 0.0025), (8, 25, 1), (8, 57, 0.00075),
(9, 1, 0.12), (9, 4, 0.00075), (9, 6, 0.0035), (9, 14, 0.045), (9, 21, 0.02), (9, 30, 0.015), (9, 53, 0.15), (9, 57, 0.000375),
(10, 2, 0.25), (10, 4, 0.003), (10, 10, 0.00075), (10, 11, 0.00075), (10, 12, 0.0005), (10, 13, 0.007), (10, 14, 0.015), (10, 15, 0.05), (10, 16, 0.0025), (10, 38, 0.09), (10, 39, 0.03), (10, 57, 0.00075),
(11, 2, 0.25), (11, 4, 0.003375), (11, 9, 0.00075), (11, 10, 0.00075), (11, 11, 0.00075), (11, 12, 0.0005), (11, 14, 0.015), (11, 57, 0.00075),
(12, 4, 0.003), (12, 9, 0.0015), (12, 10, 0.0015), (12, 11, 0.0015), (12, 54, 0.35),
(13, 2, 0.25), (13, 4-savory), (13, 4, 0.003), (13, 8, 0.045), (13, 9, 0.0015), (13, 10, 0.0015), (13, 11, 0.0015), (13, 14, 0.0075), (13, 23, 0.0075), (13, 25, 1),
(14, 4, 0.002), (14, 6, 0.015), (14, 9, 0.001), (14, 10, 0.005), (14, 11, 0.005), (14, 14, 0.015), (14, 29, 0.0075), (14, 30, 0.003), (14, 31, 0.002), (14, 32, 0.00025), (14, 54, 0.25),
(15, 2, 0.15), (15, 4, 0.002), (15, 7, 0.02), (15, 8, 0.015), (15, 9, 0.000375), (15, 10, 0.000375), (15, 11, 0.000375), (15, 14, 0.01), (15, 15, 0.05), (15, 20, 0.15), (15, 57, 0.0005),
(16, 2, 0.15), (16, 4, 0.002), (16, 5, 0.001), (16, 7, 0.00625), (16, 10, 0.00075), (16, 11, 0.00075), (16, 12, 0.00075), (16, 14, 0.025), (16, 19, 0.0125), (16, 20, 0.125), (16, 21, 0.0125), (16, 30, 0.0075), (16, 36, 0.00025), (16, 40, 0.075), (16, 41, 0.0375), (16, 57, 0.002),
(17, 4, 0.000375), (17, 7, 0.00625), (17, 13, 0.015), (17, 16, 0.00125), (17, 42, 0.06),
(18, 4, 0.00125), (18, 7, 0.00625), (18, 9, 0.001), (18, 10, 0.000375), (18, 11, 0.000375), (18, 12, 0.00025), (18, 13, 0.015), (18, 14, 0.0075), (18, 15, 0.05), (18, 21, 0.025), (18, 26, 0.15), (18, 27, 0.05), (18, 39, 0.0075), (18, 43, 0.06), (18, 55, 0.0006), (18, 57, 0.00025),
(19, 4, 0.002), (19, 5, 0.0015), (19, 7, 0.00625), (19, 14, 0.015), (19, 19, 0.15), (19, 21, 0.025), (19, 34, 0.025), (19, 36, 0.00025), (19, 42, 0.06), (19, 57, 0.000375),
(20, 4, 0.0008), (20, 7, 0.00125), (20, 9, 0.000375), (20, 10, 0.000375), (20, 11, 0.000375), (20, 13, 0.003), (20, 14, 0.0075), (20, 15, 0.05), (20, 16, 0.00125), (20, 26, 0.12), (20, 39, 0.002), (20, 42, 0.06), (20, 44, 0.000325),
(21, 4, 0.01), (21, 7, 0.00625), (21, 13, 0.015), (21, 14, 0.0075), (21, 15, 0.05), (21, 39, 0.0075), (21, 42, 0.06), (21, 45, 0.12), (21, 53, 0.00025), (21, 57, 0.0004),
(22, 3, 1), (22, 4, 0.0005), (22, 14, 0.02), (22, 21, 0.025), (22, 29, 0.01), (22, 33, 0.0075), (22, 34, 0.06), (22, 46, 0.0375), (22, 47, 0.1), (22, 48, 0.0375),
(23, 3, 1), (23, 4, 0.0002), (23, 8, 0.015), (23, 9, 0.000375), (23, 10, 0.000375), (23, 11, 0.000375), (23, 14, 0.0075), (23, 18, 1), (23, 20, 0.05), (23, 29, 0.0075), (23, 31, 0.00375), (23, 57, 0.000375),
(24, 3, 1), (24, 4, 0.000375), (24, 11, 0.000375), (24, 14, 0.0075), (24, 19, 0.02), (24, 20, 0.1), (24, 29, 0.0075), (24, 31, 0.0075), (24, 33, 0.0075), (24, 41, 0.04),
(25, 4, 0.00075), (25, 14, 0.015), (25, 21, 0.025), (25, 25, 1), (25, 26, 0.15), (25, 29, 0.0075), (25, 32, 0.00075), (25, 33, 0.0075), (25, 34, 0.04), (25, 46, 0.05), (25, 47, 0.1), (25, 48, 0.015),
(26, 4, 0.002), (26, 9, 0.0015), (26, 10, 0.00075), (26, 11, 0.00075), (26, 14, 0.01), (26, 16, 0.0075), (26, 18, 1), (26, 21, 0.0125), (26, 26, 0.12),
(27, 4, 0.001), (27, 13, 0.007), (27, 14, 0.015), (27, 15, 0.05), (27, 45, 0.2),
(28, 4, 0.0005), (28, 9, 0.001), (28, 14, 0.005), (28, 19, 0.015), (28, 21, 0.015), (28, 34, 0.015), (28, 50, 0.03), (28, 51, 0.03),
(29, 3, 1), (29, 4, 0.001), (29, 14, 0.003), (29, 19, 0.05), (29, 21, 0.025), (29, 29, 0.0075), (29, 32, 0.0025), (29, 33, 0.01), (29, 34, 0.05), (29, 52, 0.1), (29, 53, 0.05),
(30, 4, 0.0003), (30, 14, 0.0075), (30, 16, 0.00125), (30, 21, 0.05), (30, 32, 0.005), (30, 34, 0.25), (30, 38, 0.015),
(31, 4, 0.0005), (31, 10, 0.00075), (31, 11, 0.00075), (31, 13, 0.0075), (31, 14, 0.0075), (31, 19, 0.2),
(32, 1, 0.2), (32, 4, 0.0005), (32, 13, 0.007), (32, 14, 0.0075), (32, 15, 0.1), (32, 16, 0.00125), (32, 57, 0.00075);

-- Insert into customer (updated with JSON address format, customer_id omitted due to trigger)
INSERT INTO customer (customer_name, phone, password, loyalty_point, email, address) VALUES
('John Doe', '1234567890', 'pass123', 50.5, 'john.doe@email.com', '{"ward":"Ben Nghe Ward","district":"District 1","street":"Nguyen Hue","houseNumber":"123","buildingName":"Sunrise","block":"","floor":"1","roomNumber":"101","deliveryInstructions":"Leave at reception"}'),
('Jane Smith', '2345678901', 'pass456', 30.0, 'jane.smith@email.com', '{"ward":"Ward 6","district":"District 3","street":"Le Loi","houseNumber":"456","buildingName":"Moonlight","block":"A","floor":"2","roomNumber":"213","deliveryInstructions":""}'),
('Alice Johnson', '3456789012', 'pass789', 20.75, 'alice.johnson@email.com', '{"ward":"Ward 1","district":"District 5","street":"Tran Hung Dao","houseNumber":"789","buildingName":"Starlight","block":"","floor":"3","roomNumber":"305","deliveryInstructions":"Call upon arrival"}'),
('Bob Wilson', '4567890123', 'pass101', 15.25, 'bob.wilson@email.com', '{"ward":"Ward 7","district":"District 3","street":"Vo Van Tan","houseNumber":"321","buildingName":"Sunset","block":"B","floor":"4","roomNumber":"410","deliveryInstructions":""}'),
('Emma Brown', '5678901234', 'pass202', 10.0, 'emma.brown@email.com', '{"ward":"Ben Thanh Ward","district":"District 1","street":"Nguyen Thi Minh Khai","houseNumber":"654","buildingName":"Skyview","block":"","floor":"5","roomNumber":"512","deliveryInstructions":"Leave at door"}');

-- Insert into staff (corrected pay_rates to pay_rate, added staff_email and password)
INSERT INTO staff (staff_name, staff_email, password, role, phone, pay_rates) VALUES
('Michael Green', 'michael.green@restaurant.com', '$2a$12$6pe85m5bssvGNtI6PwIwcuReNeFl.4.rJxd4Iyod2Ez37z88P1wrm', 'Manager', '6789012345', 50000),
('Sarah Davis', 'sarah.davis@restaurant.com', '$2a$12$6pe85m5bssvGNtI6PwIwcuReNeFl.4.rJxd4Iyod2Ez37z88P1wrm', 'Chef', '7890123456', 40000),
('Tom Clark', 'tom.clark@restaurant.com', '$2a$12$6pe85m5bssvGNtI6PwIwcuReNeFl.4.rJxd4Iyod2Ez37z88P1wrm', 'Order Staff', '8901234567', 30000),
('Lisa Adams', 'lisa.adams@restaurant.com', '$2a$12$6pe85m5bssvGNtI6PwIwcuReNeFl.4.rJxd4Iyod2Ez37z88P1wrm', 'Kitchen Supervisor', '9012345678', 35000),
('David Lee', 'david.lee@restaurant.com', '$2a$12$6pe85m5bssvGNtI6PwIwcuReNeFl.4.rJxd4Iyod2Ez37z88P1wrm', 'Shipper', '0123456789', 25000);

-- Insert into schedule
INSERT INTO schedule (shift_date, shift, staff_id) VALUES
('2024-06-01 08:00:00', 'Morning', 1),
('2024-06-01 16:00:00', 'Evening', 2),
('2024-06-02 08:00:00', 'Morning', 3),
('2024-06-02 16:00:00', 'Evening', 4),
('2024-06-03 08:00:00', 'Morning', 5);

-- Insert into restock (each supplier supplies at least once)
INSERT INTO restock (restock_id, restock_date, supplier_id) VALUES
(1, '2024-06-01 10:00:00', 1),
(2, '2024-06-02 09:00:00', 2),
(3, '2024-06-03 11:00:00', 3),
(4, '2024-06-04 10:00:00', 4),
(5, '2024-06-05 10:00:00', 5),
(6, '2024-06-06 10:00:00', 6),
(7, '2024-06-07 10:00:00', 7),
(8, '2024-06-08 10:00:00', 8),
(9, '2024-06-09 10:00:00', 9),
(10, '2024-06-10 10:00:00', 10),
(11, '2024-06-11 10:00:00', 11),
(12, '2024-06-12 10:00:00', 12),
(13, '2024-06-13 10:00:00', 13);

-- Insert into restock_detail (each ingredient supplied at least once, using Cost per unit from Ingredients.csv)
INSERT INTO restock_detail (restock_id, ingredient_id, import_quantity, import_price) VALUES
(1, 1, 10, 618000), (1, 2, 20, 91200), (1, 3, 50, 3000), (1, 4, 5, 9000), (1, 5, 5, 32000), (1, 6, 2, 500000), (1, 7, 3, 512000), (1, 8, 3, 117000), (1, 13, 5, 300000), (1, 14, 5, 400000),
(1, 15, 20, 180000), (1, 16, 1, 100000), (1, 17, 3, 100000), (1, 18, 100, 8500), (1, 19, 10, 34000), (1, 20, 10, 32000), (1, 21, 10, 25000), (1, 22, 3, 55000), (1, 23, 3, 48000), (1, 24, 50, 40000),
(1, 25, 100, 2500), (1, 26, 5, 300000), (1, 27, 5, 55000), (1, 28, 3, 35000), (1, 29, 3, 50000), (1, 30, 3, 32000), (1, 37, 3, 250000), (1, 39, 5, 35000), (1, 42, 5, 82000), (1, 43, 5, 70000),
(1, 44, 10, 29000), (1, 32, 2, 66000), (1, 33, 5, 30000), (1, 34, 10, 28000), (1, 35, 5, 30000), (1, 36, 1, 70000), (1, 40, 5, 23000), (1, 41, 5, 55000), (1, 46, 5, 10000), (1, 52, 5, 140000),
(1, 53, 5, 20000), (1, 9, 1, 500000), (1, 10, 1, 150000), (1, 11, 1, 550000), (1, 12, 1, 40000), (1, 31, 3, 47000), (1, 47, 10, 35000), (1, 48, 3, 70000), (1, 49, 3, 15000), (1, 50, 3, 70000),
(1, 51, 3, 160000), (1, 55, 1, 120000), (1, 56, 1, 500000), (1, 57, 1, 110000),
(2, 2, 10, 91200), (2, 26, 5, 300000), (2, 45, 3, 240000), (2, 54, 5, 97800),
(3, 2, 10, 91200), (3, 54, 5, 97800),
(4, 2, 10, 91200), (4, 54, 5, 97800),
(5, 2, 10, 91200), (5, 26, 5, 300000), (5, 54, 5, 97800),
(6, 25, 100, 2500),
(7, 38, 3, 400000), (7, 39, 5, 35000),
(8, 7, 3, 512000), (8, 37, 3, 250000), (8, 38, 3, 400000), (8, 39, 5, 35000),
(9, 1, 5, 618000), (9, 26, 5, 300000), (9, 45, 3, 240000),
(10 scripting, 4, 5, 9000), (10, 5, 5, 32000), (10, 9, 1, 500000), (10, 10, 1, 150000), (10, 11, 1, 550000), (10, 12, 1, 40000), (10, 29, 3, 50000), (10, 31, 3, 47000), (10, 47, 10, 35000), (10, 48, 3, 70000),
(10, 49, 3, 15000), (10, 50, 3, 70000), (10, 51, 3, 160000),
(11, 2, 10, 91200), (11, 3, 50, 3000), (11, 4, 5, 9000), (11, 5, 5, 32000), (11, 13, 5, 300000), (11, 15, 20, 180000), (11, 16, 1, 100000), (11, 19, 10, 34000), (11, 20, 10, 32000), (11, 21, 10, 25000),
(11, 25, 100, 2500), (11, 26, 5, 300000), (11, 27, 5, 55000), (11, 32, 2, 66000), (11, 33, 5, 30000), (11, 34, 10, 28000), (11, 35, 5, 30000), (11, 36, 1, 70000), (11, 40, 5, 23000), (11, 41, 5, 55000),
(11, 46, 5, 10000), (11, 52, 5, 140000), (11, 53, 5, 20000),
(12, 1, 5, 618000), (12, 2, 10, 91200), (12, 3, 50, 3000), (12, 4, 5, 9000), (12, 5, 5, 32000), (12, 6, 2, 500000), (12, 7, 3, 512000), (12, 8, 3, 117000), (12, 13, 5, 300000), (12, 14, 5, 400000),
(12, 15, 20, 180000), (12, 17, 3, 100000), (12, 18, 100, 8500), (12, 19, 10, 34000), (12, 20, 10, 32000), (12, 21, 10, 25000), (12, 22, 3, 55000), (12, 23, 3, 48000), (12, 24, 50, 40000), (12, 25, 100, 2500),
(12, 26, 5, 300000), (12, 27, 5, 55000), (12, 28, 3, 35000), (12, 29, 3, 50000), (12, 30, 3, 32000), (12, 37, 3, 250000), (12, 39, 5, 35000), (12, 42, 5, 82000), (12, 43, 5, 70000), (12, 44, 10, 29000),
(12, 35, 5, 30000), (12, 36, 1, 70000), (12, 40, 5, 23000), (12, 41, 5, 55000), (12, 46, 5, 10000), (12, 52, 5, 140000), (12, 53, 5, 20000), (12, 9, 1, 500000), (12, 10, 1, 150000), (12, 11, 1, 550000),
(12, 12, 1, 40000), (12, 31, 3, 47000), (12, 47, 10, 35000), (12, 48, 3, 70000), (12, 49, 3, 15000), (12, 50, 3, 70000), (12, 51, 3, 160000), (12, 55, 1, 120000), (12, 56, 1, 500000), (12, 57, 1, 110000),
(13, 1, 5, 618000), (13, 2, 10, 91200), (13, 3, 50, 3000), (13, 4, 5, 9000), (13, 5, 5, 32000), (13, 6, 2, 500000), (13, 7, 3, 512000), (13, 8, 3, 117000), (13, 13, 5, 300000), (13, 14, 5, 400000),
(13, 15, 20, 180000), (13, 17, 3, 100000), (13, 18, 100, 8500), (13, 19, 10, 34000), (13, 20, 10, 32000), (13, 21, 10, 25000), (13, 22, 3, 55000), (13, 23, 3, 48000), (13, 24, 50, 40000), (13, 25, 100, 2500),
(13, 26, 5, 300000), (13, 27, 5, 55000), (13, 28, 3, 35000), (13, 29, 3, 50000), (13, 30, 3, 32000), (13, 37, 3, 250000), (13, 39, 5, 35000), (13, 42, 5, 82000), (13, 43, 5, 70000), (13, 44, 10, 29000),
(13, 35, 5, 30000), (13, 36, 1, 70000), (13, 40, 5, 23000), (13, 41, 5, 55000), (13, 46, 5, 10000), (13, 52, 5, 140000), (13, 53, 5, 20000), (13, 9, 1, 500000), (13, 10, 1, 150000), (13, 11, 1, 550000),
(13, 12, 1, 40000), (13, 31, 3, 47000), (13, 47, 10, 35000), (13, 48, 3, 70000), (13, 49, 3, 15000), (13, 50, 3, 70000), (13, 51, 3, 160000), (13, 55, 1, 120000), (13, 56, 1, 500000), (13, 57, 1, 110000);

-- Insert into waste (at least two records for outdated food, using expiration durations)
INSERT INTO waste (waste_id, waste_date) VALUES
(1, '2024-06-15 12:00:00'),
(2, '2024-07-10 14:00:00');

-- Insert into waste_detail (outdated ingredients with short expiration durations: Salmon Fillet, Lettuce, Spinach)
INSERT INTO waste_detail (waste_id, ingredient_id, quantity, reason) VALUES
(1, 1, 2, 'Salmon Fillet outdated, expired after 3 days'),
(1, 20, 3, 'Lettuce outdated, spoiled after 3 days'),
(2, 53, 2, 'Spinach outdated, wilted after 3 days');

-- Insert into sale (realistic sales from June 2024, using calculated recipe prices, updated payment_method)
INSERT INTO sale (sale_time, total_amount, payment_method, completion_time, status, customer_id, delivery_address, delivery_distance, delivery_charge) VALUES
('2024-06-01 12:30:00', 200000, 'cash', '2024-06-01 13:00:00', 'Completed', 1, '{"ward":"Ben Nghe Ward","district":"District 1","street":"Nguyen Hue","houseNumber":"123","buildingName":"Sunrise","block":"","floor":"1","roomNumber":"101","deliveryInstructions":"Leave at reception"}', 2.5, 10000),
('2024-06-05 18:45:00', 42000, 'momo', '2024-06-05 19:15:00', 'Completed', 2, '{"ward":"Ward 6","district":"District 3","street":"Le Loi","houseNumber":"456","buildingName":"Moonlight","block":"A","floor":"2","roomNumber":"213","deliveryInstructions":""}', 3.0, 12000),
('2024-06-10 13:00:00', 54000, 'cash', '2024-06-10 13:30:00', 'Completed', 3, '{"ward":"Ward 1","district":"District 5","street":"Tran Hung Dao","houseNumber":"789","buildingName":"Starlight","block":"","floor":"3","roomNumber":"305","deliveryInstructions":"Call upon arrival"}', 4.0, 15000),
('2024-07-01 19:00:00', 23000, 'momo', '2024-07-01 19:30:00', 'Completed', 4, '{"ward":"Ward 7","district":"District 3","street":"Vo Van Tan","houseNumber":"321","buildingName":"Sunset","block":"B","floor":"4","roomNumber":"410","deliveryInstructions":""}', 2.0, 8000),
('2024-07-15 12:15:00', 69000, 'cash', '2024-07-15 12:45:00', 'Completed', 5, '{"ward":"Ben Thanh Ward","district":"District 1","street":"Nguyen Thi Minh Khai","houseNumber":"654","buildingName":"Skyview","block":"","floor":"5","roomNumber":"512","deliveryInstructions":"Leave at door"}', 1.5, 6000),
('2024-08-01 17:30:00', 103000, 'momo', '2024-08-01 18:00:00', 'Completed', 1, '{"ward":"Ben Nghe Ward","district":"District 1","street":"Nguyen Hue","houseNumber":"123","buildingName":"Sunrise","block":"","floor":"1","roomNumber":"101","deliveryInstructions":"Leave at reception"}', 2.5, 10000),
('2024-08-10 14:00:00', 82000, 'cash', '2024-08-10 14:30:00', 'Completed', 2, '{"ward":"Ward 6","district":"District 3","street":"Le Loi","houseNumber":"456","buildingName":"Moonlight","block":"A","floor":"2","roomNumber":"213","deliveryInstructions":""}', 3.0, 12000);

-- Insert into order_detail
INSERT INTO order_detail (sale_id, recipe_id, quantity) VALUES
(1, 1, 1), (1, 15, 1), -- Pecan Crusted Salmon + Chicken Caesar Salad
(2, 18, 1), -- Cajun Shrimp Pasta
(3, 19, 1), (3, 30, 1), -- Pasta Pomodoro + Carrot Soup
(4, 24, 1), -- Tofu Salad
(5, 16, 1), (5, 31, 1), -- Grilled Chicken Salad + Classic Tomato Soup
(6, 9, 1), (6, 26, 1), -- Smoked Salmon Salad + Shrimp Burger
(7, 10, 1), (7, 22, 1); -- Lemon Garlic Chicken + Tofu Fried Rice

-- Insert into feedback
INSERT INTO feedback (rating, content, feedback_date, customer_id, sale_id) VALUES
(4, 'Salmon was delicious, great service!', '2024-06-01 13:30:00', 1, 1),
(3, 'Pasta was good but a bit spicy.', '2024-06-05 19:45:00', 2, 2),
(5, 'Loved the pomodoro and soup combo!', '2024-06-10 14:00:00', 3, 3),
(4, 'Tofu salad was fresh and tasty.', '2024-07-01 20:00:00', 4, 4);