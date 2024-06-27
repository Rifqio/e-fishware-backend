-- AlterTable
ALTER TABLE `fish` ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `fish_stock_transaction` ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0;
