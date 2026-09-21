-- CreateTable
CREATE TABLE `DetailSetor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beratKg` DOUBLE NOT NULL,
    `subTotalPoin` DOUBLE NOT NULL,
    `setorSampahId` INTEGER NOT NULL,
    `kategoriSampahId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DetailSetor` ADD CONSTRAINT `DetailSetor_setorSampahId_fkey` FOREIGN KEY (`setorSampahId`) REFERENCES `SetorSampah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSetor` ADD CONSTRAINT `DetailSetor_kategoriSampahId_fkey` FOREIGN KEY (`kategoriSampahId`) REFERENCES `KategoriSampah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
