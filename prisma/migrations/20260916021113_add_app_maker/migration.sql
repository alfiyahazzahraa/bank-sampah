-- CreateTable
CREATE TABLE `AppMaker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `namaSiswa` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `namaApp` VARCHAR(191) NOT NULL,
    `appKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AppMaker_email_key`(`email`),
    UNIQUE INDEX `AppMaker_appKey_key`(`appKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
