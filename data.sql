
DROP DATABASE IF EXISTS amazonDB;
CREATE database amazonDB;

USE amazonDB;

CREATE TABLE products (
  item_ID INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity DECIMAL(250) NULL,
  PRIMARY KEY (item_ID)
);

SELECT * FROM products;
