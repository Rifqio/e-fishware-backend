/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `promotion` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `promotion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `promotion` DROP FOREIGN KEY `promotion_created_by_id_fkey`;

-- AlterTable
ALTER TABLE `promotion` DROP COLUMN `created_by_id`,
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `promotion` ADD CONSTRAINT `promotion_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
