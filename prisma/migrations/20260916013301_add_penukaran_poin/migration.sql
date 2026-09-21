-- CreateTable
CREATE TABLE `PenukaranPoin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodePenukaran` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `poinTerpakai` DOUBLE NOT NULL,
    `status` ENUM('diproses', 'selesai') NOT NULL,
    `nasabahId` INTEGER NOT NULL,
    `hadiahId` INTEGER NOT NULL,

    UNIQUE INDEX `PenukaranPoin_kodePenukaran_key`(`kodePenukaran`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PenukaranPoin` ADD CONSTRAINT `PenukaranPoin_nasabahId_fkey` FOREIGN KEY (`nasabahId`) REFERENCES `Nasabah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenukaranPoin` ADD CONSTRAINT `PenukaranPoin_hadiahId_fkey` FOREIGN KEY (`hadiahId`) REFERENCES `Hadiah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
