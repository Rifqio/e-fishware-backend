/*
  Warnings:

  - A unique constraint covering the columns `[fcm_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `fcm_token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_fcm_token_key` ON `users`(`fcm_token`);
