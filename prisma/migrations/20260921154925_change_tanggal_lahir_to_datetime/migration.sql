/*
  Warnings:

  - You are about to alter the column `tanggalLahir` on the `nasabah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `nasabah` MODIFY `tanggalLahir` DATETIME(3) NULL;
