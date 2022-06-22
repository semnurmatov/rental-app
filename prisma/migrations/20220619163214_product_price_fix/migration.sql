/*
  Warnings:

  - You are about to drop the `price` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currencyId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `price` DROP FOREIGN KEY `Price_currencyId_fkey`;

-- DropForeignKey
ALTER TABLE `price` DROP FOREIGN KEY `Price_productId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `currencyId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `price`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
