-- AlterTable
ALTER TABLE `promotion` ADD COLUMN `base_price` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `discount` INTEGER NOT NULL DEFAULT 0;