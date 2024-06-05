-- DropForeignKey
ALTER TABLE `fish_stock` DROP FOREIGN KEY `fish_stock_fish_type_fkey`;

-- CreateTable
CREATE TABLE `promotion` (
    `id_promotion` VARCHAR(191) NOT NULL,
    `fish_id` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_promotion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fish_stock` ADD CONSTRAINT `fish_stock_fish_type_fkey` FOREIGN KEY (`fish_type`) REFERENCES `fish`(`type`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion` ADD CONSTRAINT `promotion_fish_id_fkey` FOREIGN KEY (`fish_id`) REFERENCES `fish`(`id_fish`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion` ADD CONSTRAINT `promotion_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
