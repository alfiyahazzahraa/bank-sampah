-- CreateTable
CREATE TABLE `KategoriSampah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaKategori` VARCHAR(191) NOT NULL,
    `hargaPerKg` DOUBLE NOT NULL,
    `poinPerKg` DOUBLE NOT NULL,
    `jenis` ENUM('PLASTIK', 'KERTAS', 'LOGAM', 'KACA') NOT NULL,
    `foto` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
