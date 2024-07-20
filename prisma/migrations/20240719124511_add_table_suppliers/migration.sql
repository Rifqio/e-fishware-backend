-- AlterTable
ALTER TABLE `fish_stock_transaction` ADD COLUMN `supplier_id` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `suppliers` (
    `id_supplier` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_supplier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fish_stock_transaction` ADD CONSTRAINT `fish_stock_transaction_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id_supplier`) ON DELETE SET NULL ON UPDATE CASCADE;
