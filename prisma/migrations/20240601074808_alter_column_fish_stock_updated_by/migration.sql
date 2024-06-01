/*
  Warnings:

  - You are about to drop the column `fish_stock_id_fish_stock` on the `fish_stock_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `fish_stock_transaction` table. All the data in the column will be lost.
  - Added the required column `updated_by` to the `fish_stock_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `fish_stock_transaction` DROP FOREIGN KEY `fish_stock_transaction_fish_stock_id_fish_stock_fkey`;

-- DropForeignKey
ALTER TABLE `fish_stock_transaction` DROP FOREIGN KEY `fish_stock_transaction_updated_by_id_fkey`;

-- AlterTable
ALTER TABLE `fish_stock_transaction` DROP COLUMN `fish_stock_id_fish_stock`,
    DROP COLUMN `updated_by_id`,
    ADD COLUMN `fish_stock_id` VARCHAR(191) NULL,
    ADD COLUMN `updated_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_fish_stock_id_fkey` FOREIGN KEY (`fish_stock_id`) REFERENCES `fish_stock`(`id_fish_stock`) ON DELETE SET NULL ON UPDATE CASCADE;
