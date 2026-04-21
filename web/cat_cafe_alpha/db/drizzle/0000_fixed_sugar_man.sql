-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_name` varchar(100),
	`image_url` text,
	`day` varchar(15),
	`category` enum('food','drinks'),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);

*/