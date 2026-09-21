-- AlterTable
ALTER TABLE `hadiah` ADD COLUMN `deskripsi` VARCHAR(191) NULL,
    MODIFY `poinDibutuhkan` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `nasabah` ADD COLUMN `tanggalLahir` DATETIME(3) NULL;
