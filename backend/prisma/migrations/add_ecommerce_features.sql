-- Migration: Add ecommerce features
-- Run: npx prisma db push   OR   apply this SQL directly to your MySQL database

-- Password reset tokens (secure email-based flow)
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT NOT NULL UNIQUE,
  `token`      VARCHAR(64) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`token`),
  CONSTRAINT `prt_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Wishlists
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `wl_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `wishlist_id` INT NOT NULL,
  `product_id`  INT NOT NULL,
  `added_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_wl_product` (`wishlist_id`, `product_id`),
  INDEX (`wishlist_id`),
  INDEX (`product_id`),
  CONSTRAINT `wli_wl_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON DELETE CASCADE,
  CONSTRAINT `wli_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Discount codes / coupons
CREATE TABLE IF NOT EXISTS `discount_codes` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `code`             VARCHAR(50) NOT NULL UNIQUE,
  `description`      VARCHAR(255),
  `discount_type`    VARCHAR(20) NOT NULL,  -- 'percent' or 'fixed'
  `discount_value`   DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2),
  `max_uses`         INT,
  `uses_count`       INT NOT NULL DEFAULT 0,
  `is_active`        BOOLEAN NOT NULL DEFAULT TRUE,
  `expires_at`       TIMESTAMP NULL,
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (`code`),
  INDEX (`is_active`)
);

CREATE TABLE IF NOT EXISTS `coupon_usages` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `discount_code_id` INT NOT NULL,
  `user_id`          INT NOT NULL,
  `order_id`         INT,
  `used_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_coupon_user` (`discount_code_id`, `user_id`),
  INDEX (`discount_code_id`),
  INDEX (`user_id`),
  CONSTRAINT `cu_code_fk` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes`(`id`) ON DELETE CASCADE,
  CONSTRAINT `cu_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Product variants (size, color, SKU)
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `product_id`  INT NOT NULL,
  `name`        VARCHAR(100) NOT NULL,
  `sku`         VARCHAR(100),
  `size`        VARCHAR(50),
  `color`       VARCHAR(50),
  `material`    VARCHAR(100),
  `stock`       INT NOT NULL DEFAULT 0,
  `price_delta` DECIMAL(10,2),
  `image_url`   VARCHAR(500),
  `is_active`   BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (`product_id`),
  CONSTRAINT `pv_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Return / refund requests
CREATE TABLE IF NOT EXISTS `return_requests` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `order_id`      INT NOT NULL,
  `user_id`       INT NOT NULL,
  `reason`        VARCHAR(50) NOT NULL,
  `description`   TEXT,
  `status`        VARCHAR(30) NOT NULL DEFAULT 'pending',
  `refund_amount` DECIMAL(10,2),
  `admin_notes`   TEXT,
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (`order_id`),
  INDEX (`user_id`),
  INDEX (`status`),
  CONSTRAINT `rr_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `rr_user_fk`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)  ON DELETE CASCADE
);

-- Admin audit logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id`    INT,
  `admin_name`  VARCHAR(100),
  `action`      VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50)  NOT NULL,
  `entity_id`   INT,
  `old_value`   TEXT,
  `new_value`   TEXT,
  `ip_address`  VARCHAR(45),
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`admin_id`),
  INDEX (`entity_type`, `entity_id`),
  INDEX (`created_at`)
);

-- Add is_banned column to users (for customer management)
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `is_banned` BOOLEAN NOT NULL DEFAULT FALSE;

-- Add coupon fields to orders
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `discount_code` VARCHAR(50) NULL;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `discount_amount` DECIMAL(10,2) NULL DEFAULT 0;
