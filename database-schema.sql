

CREATE TABLE `admin` (
 `admin_id` bigint(20) NOT NULL AUTO_INCREMENT,
 `admin_name` varchar(100) DEFAULT NULL,
 `admin_email` varchar(100) DEFAULT NULL,
 `password` text DEFAULT NULL,
 `created_at` datetime NOT NULL DEFAULT current_timestamp(),
 `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4



CREATE TABLE `customer` (
 `customer_id` bigint(20) NOT NULL AUTO_INCREMENT,
 `customer_name` varchar(100) DEFAULT NULL,
 `customer_email` varchar(100) DEFAULT NULL,
 `customer_phone` varchar(30) DEFAULT NULL,
 `password` text DEFAULT NULL,
 `created_at` datetime NOT NULL DEFAULT current_timestamp(),
 `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4



CREATE TABLE `driver` (
 `driver_id` bigint(20) NOT NULL AUTO_INCREMENT,
 `driver_name` varchar(100) DEFAULT NULL,
 `driver_email` varchar(100) DEFAULT NULL,
 `driver_phone` varchar(30) DEFAULT NULL,
 `driver_car_number` varchar(100) DEFAULT NULL,
 `driver_licence` varchar(100) DEFAULT NULL,
 `driver_rating` tinyint(1) DEFAULT NULL,
 `driver_status` tinyint(1) NOT NULL DEFAULT 0,
 `password` text DEFAULT NULL,
 `created_at` datetime NOT NULL DEFAULT current_timestamp(),
 `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`driver_id`),
 UNIQUE KEY `driver_email` (`driver_email`),
 UNIQUE KEY `driver_phone` (`driver_phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4



CREATE TABLE `booking` (
 `booking_id` bigint(20) NOT NULL AUTO_INCREMENT,
 `customer_id` bigint(20) DEFAULT NULL,
 `source_address` text DEFAULT NULL,
 `source_lat` decimal(10,0) DEFAULT NULL,
 `source_long` decimal(10,0) DEFAULT NULL,
 `destination_lat` decimal(10,0) DEFAULT NULL,
 `destination_long` decimal(10,0) DEFAULT NULL,
 `destination_address` text DEFAULT NULL,
 `booking_status` tinyint(4) DEFAULT 0,
 `driver_id` bigint(20) DEFAULT NULL,
 `booking_fare` float DEFAULT NULL,
 `created_at` datetime NOT NULL DEFAULT current_timestamp(),
 `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
