/*
  Warnings:

  - A unique constraint covering the columns `[kodePenukaran,appKey]` on the table `PenukaranPoin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kodeSetor,appKey]` on the table `SetorSampah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appKey` to the `AdminBank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appKey` to the `DetailSetor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appKey` to the `Hadiah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appKey` to the `KategoriSampah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appKey` to the `PenukaranPoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appKey` to the `SetorSampah` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PenukaranPoin_kodePenukaran_key` ON `penukaranpoin`;

-- DropIndex
DROP INDEX `SetorSampah_kodeSetor_key` ON `setorsampah`;

-- AlterTable
ALTER TABLE `adminbank` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `detailsetor` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `hadiah` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kategorisampah` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `penukaranpoin` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `setorsampah` ADD COLUMN `appKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PenukaranPoin_kodePenukaran_appKey_key` ON `PenukaranPoin`(`kodePenukaran`, `appKey`);

-- CreateIndex
CREATE UNIQUE INDEX `SetorSampah_kodeSetor_appKey_key` ON `SetorSampah`(`kodeSetor`, `appKey`);
