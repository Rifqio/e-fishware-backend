-- CreateTable
CREATE TABLE `users` (
    `id_user` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_employee_id_key`(`employee_id`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse` (
    `id_warehouse` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_warehouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fish` (
    `id_fish` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `fish_id_fish_key`(`id_fish`),
    UNIQUE INDEX `fish_type_key`(`type`),
    PRIMARY KEY (`id_fish`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fish_stock` (
    `id_fish_stock` VARCHAR(191) NOT NULL,
    `fish_type` VARCHAR(191) NOT NULL,
    `warehouse_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `min_stock` INTEGER NOT NULL,
    `max_stock` INTEGER NOT NULL,

    PRIMARY KEY (`id_fish_stock`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fish_stock_transaction` (
    `id_fish_stock_transaction` INTEGER NOT NULL AUTO_INCREMENT,
    `fish_id` VARCHAR(191) NOT NULL,
    `warehouse_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `transaction_type` ENUM('IN', 'OUT') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by_id` VARCHAR(191) NOT NULL,
    `fish_stock_id_fish_stock` VARCHAR(191) NULL,

    PRIMARY KEY (`id_fish_stock_transaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fish_stock` ADD CONSTRAINT `fish_stock_fish_type_fkey` FOREIGN KEY (`fish_type`) REFERENCES `fish`(`type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock` ADD CONSTRAINT `fish_stock_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_fish_id_fkey` FOREIGN KEY (`fish_id`) REFERENCES `fish`(`id_fish`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_updated_by_id_fkey` FOREIGN KEY (`updated_by_id`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_fish_stock_id_fish_stock_fkey` FOREIGN KEY (`fish_stock_id_fish_stock`) REFERENCES `fish_stock`(`id_fish_stock`) ON DELETE SET NULL ON UPDATE CASCADE;
