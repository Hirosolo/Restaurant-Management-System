create database restaurant_db;

use restaurant_db;

create table customer(
	customer_id int auto_increment primary key,
    customer_name varchar(100),
    phone varchar(10),
    password varchar(100),
    loyalty_point float,
    email text,
    address text
);

create table staff(
	staff_id int auto_increment primary key,
    staff_name varchar(100) not null,
    role enum('Manager','Chef','Order Staff','Kitchen Supervisor','Shipper') not null,
    phone varchar(10),
    pay_rates float
);
create table schedule(
	schedule_id int auto_increment primary key,
    shift_date datetime not null,
    shift enum ('Morning', 'Evening') not null,
    staff_id int,
    foreign key (staff_id) references staff(staff_id)
);

create table recipe(
	recipe_id int auto_increment primary key,
    recipe_name varchar(100),
    category enum('Main Dishes', 'Side Dishes', 'Salads', 'Pasta & Noodles', 'Rice Dishes', 'Soup'),
    calories float,
    protein float,
    fat float,
    carbohydrate float,
    fiber float,
    price float,
    image_url text
);
create table ingredient(
	ingredient_id int auto_increment primary key,
    ingredient_name varchar(100),
    quantity float,
    unit varchar(20),
    minimum_threshold float
);

create table recipe_detail(
	recipe_id int,
    ingredient_id int,
    weight float,
    foreign key (recipe_id) references recipe(recipe_id),
    foreign key (ingredient_id) references ingredient(ingredient_id)
);
alter table recipe_detail add primary key (recipe_id, ingredient_id);

create table sale(
	sale_id int auto_increment primary key,
    sale_time datetime default current_timestamp,
    total_amount float,
    payment_method enum('Cash', 'Online Transfer'),
    completion_time datetime,
    status varchar(20) default 'Pending',
    customer_id int,
    delivery_address text,
    delivery_distance float,
    delivery_charge float,
    foreign key (customer_id) references customer(customer_id)
);
alter table sale add column delivery_charge float;

create table order_detail(
	sale_id int,
    recipe_id int,
    quantity int,
    foreign key (sale_id) references sale(sale_id),
    foreign key (recipe_id) references recipe(recipe_id)
);
alter table order_detail add primary key (sale_id,recipe_id);
create table feedback(
	feedback_id int auto_increment primary key,
    rating int,
    content text, 
    feedback_date datetime, 
    customer_id int,
    sale_id int,
    foreign key (customer_id) references customer(customer_id),
    foreign key (sale_id) references sale(sale_id)
);
create table waste(
	waste_id int auto_increment primary key,
    waste_date datetime default current_timestamp
);

create table waste_detail(
	waste_id int,
    ingredient_id int,
    quantity float,
    reason text,
    foreign key (waste_id) references waste(waste_id),
    foreign key (ingredient_id) references ingredient(ingredient_id)
);
alter table waste_detail add primary key (waste_id, ingredient_id);

create table supplier(
	supplier_id int auto_increment primary key,
    supplier_name varchar(100),
    phone varchar(10),
    address text
);

create table supplier_product(
	ingredient_id int,
    supplier_id int,
    foreign key (ingredient_id) references ingredient(ingredient_id),
    foreign key (supplier_id) references supplier(supplier_id)
);
alter table supplier_product add primary key (ingredient_id,supplier_id);

create table restock(
	restock_id int auto_increment primary key,
    restock_date datetime default current_timestamp,
    supplier_id int,
    foreign key (supplier_id) references supplier(supplier_id)
);

create table restock_detail(
	restock_id int,
    ingredient_id int,
    import_quantity float,
    import_price float,
    foreign key (restock_id) references restock(restock_id),
    foreign key (ingredient_id) references ingredient(ingredient_id)
);

DELIMITER //

CREATE TRIGGER trg_update_ingredient_quantity_on_restock
AFTER INSERT ON restock_detail
FOR EACH ROW
BEGIN
    UPDATE ingredient
    SET quantity = quantity + NEW.import_quantity
    WHERE ingredient_id = NEW.ingredient_id;
END //

DELIMITER ;