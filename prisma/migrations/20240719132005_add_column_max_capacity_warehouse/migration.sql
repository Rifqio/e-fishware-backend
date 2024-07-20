-- DropIndex
DROP INDEX `fish_stock_transaction_supplier_id_fkey` ON `fish_stock_transaction`;

-- AlterTable
ALTER TABLE `warehouse` ADD COLUMN `max_capacity` INTEGER NOT NULL DEFAULT 0;
