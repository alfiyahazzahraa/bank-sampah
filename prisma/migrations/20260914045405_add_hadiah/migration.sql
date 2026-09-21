-- CreateTable
CREATE TABLE `Hadiah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaHadiah` VARCHAR(191) NOT NULL,
    `poinDibutuhkan` DOUBLE NOT NULL,
    `stok` INTEGER NOT NULL,
    `foto` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
