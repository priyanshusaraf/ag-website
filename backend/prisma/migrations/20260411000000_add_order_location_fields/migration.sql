-- Add structured location columns to orders table for rigorous international detection
-- country: dedicated column so we can query/cross-validate reliably (not embedded in text blob)
-- phone: dedicated column so we can look up customer contact without parsing text
-- is_international: boolean flag driven by country != "India"; controls the $75 USD shipping fee

ALTER TABLE `orders` ADD COLUMN `country` VARCHAR(100) NULL AFTER `shipping_address`;

ALTER TABLE `orders` ADD COLUMN `phone` VARCHAR(20) NULL AFTER `country`;

ALTER TABLE `orders` ADD COLUMN `is_international` BOOLEAN NOT NULL DEFAULT FALSE AFTER `phone`;

CREATE INDEX `is_international` ON `orders`(`is_international`);
