-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('NASABAH', 'ADMIN') NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nasabah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaNasabah` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NOT NULL,
    `saldoPoin` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `foto` VARCHAR(191) NULL,

    UNIQUE INDEX `Nasabah_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminBank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaUnit` VARCHAR(191) NOT NULL,
    `namaPengelola` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `AdminBank_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Nasabah` ADD CONSTRAINT `Nasabah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminBank` ADD CONSTRAINT `AdminBank_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
