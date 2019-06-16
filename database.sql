DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255),
  department_name VARCHAR(255),
  price DECIMAL(10,2),
  stock_quantity INT(8),
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal', 'Electronics', 19.99, 350);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Beats Studio3 Wireless Noise Canceling Over-Ear Headphones - Matte Black', 'Electronics', 279.95, 230);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Native Unisex Kids Jefferson Slip-On Sneaker', 'Clothing', 30.27, 69);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Graco Modes Jogger SE Stroller, Tenley', 'Baby stuff', 219.99, 34);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Viva Naturals Premium Non-GMO Vitamin C with Bioflavonoids & Rose Hips, 1000 mg, 250 Veg Caps', 'Dietary supplements', 18.99, 23);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('AmazonBasics Neoprene Dumbbell Pairs and Sets with Stands', 'Sports', 28.49, 293);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Everlast Pro Style Training Gloves', 'Sports', 14.39, 27);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('BalanceFrom GoYoga All Purpose High Density Non-Slip Exercise Yoga Mat with Carrying Strap', 'Sports', 12.99, 300);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('PANASONIC LUMIX FZ80 4K Digital Camera, 18.1 Megapixel Video Camera, 60X Zoom DC VARIO 20-1200mm Lens, F2.8-5.9 Aperture, POWER O.I.S. Stabilization, Touch Enabled 3-Inch LCD, Wi-Fi, DC-FZ80K (Black)', 'Electronics', 297.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Google - Pixel 3a with 64GB Memory Cell Phone (Unlocked) - Just Black', 'Electronics', 399, 200);
