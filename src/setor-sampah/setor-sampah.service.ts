import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto';
import { VerifySetorDto } from './dto/verify-setor.dto';

@Injectable()
export class SetorSampahService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSetorSampahDto, nasabahId: number, appKey: string) {
    const kategoriIds = dto.items.map((item) => Number(item.kategoriSampahId));
    const kategoriList = await this.prisma.kategoriSampah.findMany({
      where: { id: { in: kategoriIds }, appKey },
    });

    if (kategoriList.length !== kategoriIds.length) {
      throw new BadRequestException('Salah satu atau lebih kategoriSampahId tidak ditemukan.');
    }

    let estimasiTotalPoin = 0;
    let totalBeratKg = 0;

    const detailSetorData = dto.items.map((item) => {
      const kategori = kategoriList.find((k) => k.id === Number(item.kategoriSampahId));
      if (!kategori) {
        throw new BadRequestException(`Kategori ID ${item.kategoriSampahId} tidak valid`);
      }

      const subtotalPoin = item.beratKg * kategori.poinPerKg;

      estimasiTotalPoin += subtotalPoin;
      totalBeratKg += item.beratKg;

      return {
        kategoriSampahId: kategori.id,
        beratKg: item.beratKg,
        subTotalPoin: subtotalPoin,
        appKey,
      };
    });

    const kodeSetor = `STR-${Date.now()}`;

    return await this.prisma.setorSampah.create({
      data: {
        kodeSetor,
        tanggal: new Date(),
        status: 'MENUNGGU_KONFIRMASI',
        catatanAdmin: dto.catatan,
        nasabahId,
        appKey,
        detailSetor: {
          create: detailSetorData,
        },
      },
      include: {
        detailSetor: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });
  }

  async findMySetor(nasabahId: number, appKey: string, bulan?: string) {
    const where: any = { nasabahId, appKey };

    if (bulan && /^\d{4}-\d{2}$/.test(bulan)) {
      const [year, month] = bulan.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      where.tanggal = { gte: startDate, lt: endDate };
    }

    return await this.prisma.setorSampah.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      include: {
        detailSetor: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });
  }

  async findAllAdmin(appKey: string, bulan?: string, status?: string) {
    const where: any = { appKey };

    if (bulan && /^\d{4}-\d{2}$/.test(bulan)) {
      const [year, month] = bulan.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      where.tanggal = { gte: startDate, lt: endDate };
    }

    if (status) {
      const statusMap: Record<string, string> = {
        menunggu_konfirmasi: 'MENUNGGU_KONFIRMASI',
        diverifikasi: 'DIVERIFIKASI',
        ditolak: 'DITOLAK',
        selesai: 'SELESAI',
      };
      where.status = statusMap[status] ?? status;
    }

    return await this.prisma.setorSampah.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      include: {
        nasabah: true,
        adminBank: true,
        detailSetor: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });
  }

  async findOne(id: number, appKey: string) {
    const data = await this.prisma.setorSampah.findFirst({
      where: { id, appKey },
      include: {
        nasabah: true,
        adminBank: true,
        detailSetor: {
          include: {
            kategoriSampah: true,
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Data penyetoran sampah tidak ditemukan');
    }

    return data;
  }

  async verify(id: number, dto: VerifySetorDto, adminBankId: number, appKey: string) {
    const setor = await this.prisma.setorSampah.findFirst({
      where: { id, appKey },
      include: { detailSetor: true },
    });

    if (!setor) {
      throw new NotFoundException('Data penyetoran sampah tidak ditemukan');
    }

    if (setor.status !== 'MENUNGGU_KONFIRMASI') {
      throw new BadRequestException('Transaksi ini sudah diverifikasi sebelumnya');
    }

    const statusMap: Record<string, 'DIVERIFIKASI' | 'DITOLAK' | 'SELESAI'> = {
      diverifikasi: 'DIVERIFIKASI',
      ditolak: 'DITOLAK',
      selesai: 'SELESAI',
    };
    const statusBaru = statusMap[dto.status];

    if (statusBaru === 'DITOLAK') {
      return await this.prisma.setorSampah.update({
        where: { id },
        data: {
          status: statusBaru,
          catatanAdmin: dto.catatanAdmin,
          adminBankId,
        },
        include: {
          nasabah: true,
          detailSetor: { include: { kategoriSampah: true } },
        },
      });
    }

    return await this.prisma.$transaction(async (tx) => {
      let totalPoinDiperoleh = 0;

      if (dto.itemsReal && dto.itemsReal.length > 0) {
        const kategoriIds = dto.itemsReal.map((i) => Number(i.kategoriSampahId));
        const kategoriList = await tx.kategoriSampah.findMany({
          where: { id: { in: kategoriIds }, appKey },
        });

        await tx.detailSetor.deleteMany({ where: { setorSampahId: id } });

        const detailBaru = dto.itemsReal.map((item) => {
          const kat = kategoriList.find((k) => k.id === Number(item.kategoriSampahId));
          if (!kat) {
            throw new BadRequestException(
              `Kategori ID ${item.kategoriSampahId} tidak ditemukan`,
            );
          }
          const subTotalPoin = item.beratKgReal * kat.poinPerKg;
          totalPoinDiperoleh += subTotalPoin;

          return {
            setorSampahId: id,
            kategoriSampahId: kat.id,
            beratKg: item.beratKgReal,
            subTotalPoin,
            appKey,
          };
        });

        await tx.detailSetor.createMany({ data: detailBaru });
      } else {
        totalPoinDiperoleh = setor.detailSetor.reduce(
          (acc, curr) => acc + curr.subTotalPoin,
          0,
        );
      }

      if (statusBaru === 'SELESAI') {
        await tx.nasabah.update({
          where: { id: setor.nasabahId },
          data: { saldoPoin: { increment: totalPoinDiperoleh } },
        });
      }

      const updatedSetor = await tx.setorSampah.update({
        where: { id },
        data: {
          status: statusBaru,
          catatanAdmin: dto.catatanAdmin,
          adminBankId,
        },
        include: {
          nasabah: true,
          detailSetor: { include: { kategoriSampah: true } },
        },
      });

      return updatedSetor;
    });
  }
}