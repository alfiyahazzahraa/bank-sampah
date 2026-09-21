import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RekapitulasiService {
  constructor(private prisma: PrismaService) {}

  async bulanan(appKey: string, bulan: string) {
    if (!bulan) {
      throw new BadRequestException('Parameter ?bulan wajib diisi (format YYYY-MM)');
    }

    const [year, month] = bulan.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const detailSetorList = await this.prisma.detailSetor.findMany({
      where: {
        appKey,
        setorSampah: {
          status: 'SELESAI',
          tanggal: { gte: startDate, lt: endDate },
        },
      },
      include: {
        kategoriSampah: true,
      },
    });

    let totalKg = 0;
    let totalRupiah = 0;
    let totalPoinDiterbitkan = 0;

    const breakdown: Record<string, { tonaseKg: number; rupiah: number; poin: number }> = {
      plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
      logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
    };

    for (const detail of detailSetorList) {
      const jenis = detail.kategoriSampah.jenis.toLowerCase(); 
      const rupiah = detail.beratKg * detail.kategoriSampah.hargaPerKg;

      totalKg += detail.beratKg;
      totalRupiah += rupiah;
      totalPoinDiterbitkan += detail.subTotalPoin;

      if (breakdown[jenis]) {
        breakdown[jenis].tonaseKg += detail.beratKg;
        breakdown[jenis].rupiah += rupiah;
        breakdown[jenis].poin += detail.subTotalPoin;
      }
    }

    const penukaranList = await this.prisma.penukaranPoin.findMany({
      where: {
        appKey,
        tanggal: { gte: startDate, lt: endDate },
      },
    });

    const totalTransaksiPenukaran = penukaranList.length;
    const totalPoinTerpakai = penukaranList.reduce((acc, p) => acc + p.poinTerpakai, 0);

    return {
      periode: bulan,
      rekapitulasiTonase: {
        totalKg,
        totalTon: totalKg / 1000,
        totalEstimasiPembayaranRupiah: totalRupiah,
        totalPoinDiterbitkan,
      },
      breakdownJenisSampah: breakdown,
      rekapitulasiPenukaranPoin: {
        totalTransaksiPenukaran,
        totalPoinTerpakai,
      },
    };
  }
}