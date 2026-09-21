/*
  Warnings:

  - The values [PLASTIK,KERTAS,LOGAM,KACA] on the enum `KategoriSampah_jenis` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `kategorisampah` MODIFY `jenis` ENUM('plastik', 'kertas', 'logam', 'kaca') NOT NULL;

-- CreateTable
CREATE TABLE `SetorSampah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodeSetor` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` ENUM('menunggu_konfirmasi', 'diverifikasi', 'ditolak', 'selesai') NOT NULL,
    `catatanAdmin` VARCHAR(191) NULL,
    `nasabahId` INTEGER NOT NULL,
    `adminBankId` INTEGER NULL,

    UNIQUE INDEX `SetorSampah_kodeSetor_key`(`kodeSetor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SetorSampah` ADD CONSTRAINT `SetorSampah_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorSampah` ADD CONSTRAINT `SetorSampah_adminBankId_fkey` FOREIGN KEY (`adminBankId`) REFERENCES `AdminBank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
