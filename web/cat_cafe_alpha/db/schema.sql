CREATE DATABASE CatCafeFinal;

USE CatCafeFinal;

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    image_url TEXT,
    day varchar(15),
    category ENUM('food', 'drinks')
);