import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary(nasabahId: number, appKey: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id: nasabahId, appKey },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan');
    }

    const setorSelesai = await this.prisma.setorSampah.findMany({
      where: { nasabahId, appKey, status: 'SELESAI' },
      include: { detailSetor: true },
      orderBy: { tanggal: 'desc' },
    });

    let totalSampahDisetorKg = 0;
    let totalPoinDidapat = 0;
    for (const s of setorSelesai) {
      for (const d of s.detailSetor) {
        totalSampahDisetorKg += d.beratKg;
        totalPoinDidapat += d.subTotalPoin;
      }
    }

    const penukaranList = await this.prisma.penukaranPoin.findMany({
      where: { nasabahId, appKey },
      include: { hadiah: true },
      orderBy: { tanggal: 'desc' },
    });
    const totalPoinDitukar = penukaranList.reduce((acc, p) => acc + p.poinTerpakai, 0);

    const transaksiTerakhirSetor = setorSelesai[0]
      ? {
          kodeSetor: setorSelesai[0].kodeSetor,
          tanggal: setorSelesai[0].tanggal,
          beratKg: setorSelesai[0].detailSetor.reduce((acc, d) => acc + d.beratKg, 0),
          poin: setorSelesai[0].detailSetor.reduce((acc, d) => acc + d.subTotalPoin, 0),
          status: setorSelesai[0].status,
        }
      : null;

    const transaksiTerakhirTukar = penukaranList[0]
      ? {
          kodePenukaran: penukaranList[0].kodePenukaran,
          tanggal: penukaranList[0].tanggal,
          hadiah: penukaranList[0].hadiah.namaHadiah,
          poin: penukaranList[0].poinTerpakai,
          status: penukaranList[0].status,
        }
      : null;

    return {
      saldoPoinSaatIni: nasabah.saldoPoin,
      totalSampahDisetorKg,
      totalPoinDidapat,
      totalPoinDitukar,
      transaksiTerakhirSetor,
      transaksiTerakhirTukar,
    };
  }

  async stats(appKey: string) {
    const totalNasabah = await this.prisma.nasabah.count({ where: { appKey } });
    const totalKategoriSampah = await this.prisma.kategoriSampah.count({ where: { appKey } });
    const totalTransaksiSetor = await this.prisma.setorSampah.count({ where: { appKey } });
    const totalHadiah = await this.prisma.hadiah.count({ where: { appKey } });

    const detailSetorList = await this.prisma.detailSetor.findMany({
      where: { appKey },
    });

    const totalBeratSampahKg = detailSetorList.reduce((acc, d) => acc + d.beratKg, 0);
    const totalPoinTersalurkan = detailSetorList.reduce((acc, d) => acc + d.subTotalPoin, 0);

    return {
      totalNasabah,
      totalKategoriSampah,
      totalTransaksiSetor,
      totalHadiah,
      totalBeratSampahKg,
      totalPoinTersalurkan,
    };
  }
}