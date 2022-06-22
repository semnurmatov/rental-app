/*
  Warnings:

  - Made the column `price` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `isAvailable` BOOLEAN NULL DEFAULT true,
    MODIFY `price` DOUBLE NOT NULL;
