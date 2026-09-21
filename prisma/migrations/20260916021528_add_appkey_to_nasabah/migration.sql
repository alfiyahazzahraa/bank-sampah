/*
  Warnings:

  - Added the required column `appKey` to the `Nasabah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nasabah` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;
