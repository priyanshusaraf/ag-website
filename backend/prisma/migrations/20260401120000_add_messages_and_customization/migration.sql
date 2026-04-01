-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `order_id` INTEGER NULL,
    `sender_name` VARCHAR(200) NOT NULL,
    `sender_email` VARCHAR(200) NOT NULL,
    `sender_phone` VARCHAR(50) NULL,
    `subject` VARCHAR(200) NOT NULL,
    `body` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'contact',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `messages_user_id_idx`(`user_id`),
    INDEX `messages_order_id_idx`(`order_id`),
    INDEX `messages_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AlterTable: Add customization_details to order_items
ALTER TABLE `order_items` ADD COLUMN `customization_details` TEXT NULL;

-- AlterTable: Add price_override and customization_details to cart_items
ALTER TABLE `cart_items` ADD COLUMN `price_override` DECIMAL(10, 2) NULL;
ALTER TABLE `cart_items` ADD COLUMN `customization_details` TEXT NULL;
