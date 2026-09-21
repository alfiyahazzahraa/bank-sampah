import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async generate(appKey: string) {
    const appMaker = await this.prisma.appMaker.findUnique({ where: { appKey } });
    if (!appMaker) {
      throw new BadRequestException('App Key tidak valid');
    }

    const existingUser = await this.prisma.user.findFirst({ where: { appKey } });
    if (existingUser) {
      throw new ConflictException(
        'Data untuk appKey ini sudah pernah di-seed sebelumnya.',
      );
    }

    const hashedAdminPass = await bcrypt.hash('admin123', 10);
    const hashedNasabah1Pass = await bcrypt.hash('password123', 10);
    const hashedNasabah2Pass = await bcrypt.hash('password123', 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const adminUser = await tx.user.create({
        data: {
          username: 'admin_banksampah',
          password: hashedAdminPass,
          role: 'ADMIN',
          appKey,
        },
      });
      const adminBank = await tx.adminBank.create({
        data: {
          namaUnit: 'Bank Sampah Asri Jaya',
          namaPengelola: 'Bapak H. Sukirman',
          telefon: '081234567890',
          userId: adminUser.id,
          appKey,
        },
      });

      const nasabah1User = await tx.user.create({
        data: {
          username: 'nasabah_budi',
          password: hashedNasabah1Pass,
          role: 'NASABAH',
          appKey,
        },
      });
      const nasabah1 = await tx.nasabah.create({
        data: {
          namaNasabah: 'Budi Santoso',
          alamat: 'Jl. Merdeka No. 12, RT 03/05',
          telefon: '085678901234',
          saldoPoin: 150,
          userId: nasabah1User.id,
          appKey,
        },
      });

      const nasabah2User = await tx.user.create({
        data: {
          username: 'nasabah_siti',
          password: hashedNasabah2Pass,
          role: 'NASABAH',
          appKey,
        },
      });
      const nasabah2 = await tx.nasabah.create({
        data: {
          namaNasabah: 'Siti Aminah',
          alamat: 'Jl. Mawar Indah No. 45',
          telefon: '081987654321',
          saldoPoin: 80,
          userId: nasabah2User.id,
          appKey,
        },
      });

      const kategoriPlastik = await tx.kategoriSampah.create({
        data: {
          namaKategori: 'Botol Plastik PET',
          hargaPerKg: 3500,
          poinPerKg: 10,
          jenis: 'PLASTIK',
          appKey,
        },
      });
      const kategoriKertas = await tx.kategoriSampah.create({
        data: {
          namaKategori: 'Kardus & Karton Bekas',
          hargaPerKg: 2000,
          poinPerKg: 5,
          jenis: 'KERTAS',
          appKey,
        },
      });
      const kategoriLogam = await tx.kategoriSampah.create({
        data: {
          namaKategori: 'Kaleng Aluminium / Minuman',
          hargaPerKg: 12000,
          poinPerKg: 30,
          jenis: 'LOGAM',
          appKey,
        },
      });
      const kategoriKaca = await tx.kategoriSampah.create({
        data: {
          namaKategori: 'Botol Kaca Bening',
          hargaPerKg: 1500,
          poinPerKg: 4,
          jenis: 'KACA',
          appKey,
        },
      });

      const hadiah1 = await tx.hadiah.create({
        data: {
          namaHadiah: 'Voucher Pulsa / E-Wallet Rp 25.000',
          poinDibutuhkan: 75,
          stok: 50,
          appKey,
        },
      });
      const hadiah2 = await tx.hadiah.create({
        data: {
          namaHadiah: 'Minyak Goreng Bimoli 1 Liter',
          poinDibutuhkan: 100,
          stok: 25,
          appKey,
        },
      });
      const hadiah3 = await tx.hadiah.create({
        data: {
          namaHadiah: 'Beras Super Pulen 2.5 Kg',
          poinDibutuhkan: 180,
          stok: 15,
          appKey,
        },
      });

      const setor1 = await tx.setorSampah.create({
        data: {
          kodeSetor: `STR-${Date.now()}`,
          tanggal: new Date(),
          status: 'SELESAI',
          catatanAdmin: 'Penimbangan selesai dan akurat.',
          nasabahId: nasabah1.id,
          adminBankId: adminBank.id,
          appKey,
          detailSetor: {
            create: [
              {
                kategoriSampahId: kategoriPlastik.id,
                beratKg: 10,
                subTotalPoin: 100,
                appKey,
              },
              {
                kategoriSampahId: kategoriKertas.id,
                beratKg: 5,
                subTotalPoin: 25,
                appKey,
              },
            ],
          },
        },
      });

      const penukaran1 = await tx.penukaranPoin.create({
        data: {
          kodePenukaran: `TKR-${Date.now()}`,
          tanggal: new Date(),
          poinTerpakai: hadiah1.poinDibutuhkan,
          status: 'SELESAI',
          nasabahId: nasabah1.id,
          hadiahId: hadiah1.id,
          appKey,
        },
      });

      return {
        admin: { username: 'admin_banksampah', password: 'admin123', namaUnit: adminBank.namaUnit },
        nasabah1: { username: 'nasabah_budi', password: 'password123', namaNasabah: nasabah1.namaNasabah, saldoPoin: nasabah1.saldoPoin },
        nasabah2: { username: 'nasabah_siti', password: 'password123', namaNasabah: nasabah2.namaNasabah, saldoPoin: nasabah2.saldoPoin },
        kategoriSampahCount: 4,
        hadiahKatalogCount: 3,
      };
    });

    return result;
  }
}