/*
  Warnings:

  - You are about to drop the column `fish_id` on the `fish_stock_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `fish_stock_transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `fish_stock_transaction` DROP FOREIGN KEY `fish_stock_transaction_fish_id_fkey`;

-- DropForeignKey
ALTER TABLE `fish_stock_transaction` DROP FOREIGN KEY `fish_stock_transaction_warehouse_id_fkey`;

-- AlterTable
ALTER TABLE `fish_stock_transaction` DROP COLUMN `fish_id`,
    DROP COLUMN `warehouse_id`;
