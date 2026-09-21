import { Injectable, NotFoundException, BadRequestException, ForbiddenException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto';
import { UpdateStatusPenukaranDto } from './dto/update-penukaran-poin.dto';

@Injectable()
export class PenukaranPoinService {
  constructor(private prisma: PrismaService) {}

  async tukar(dto: CreatePenukaranPoinDto, nasabahId: number, appKey: string) {
    const hadiah = await this.prisma.hadiah.findFirst({
      where: { id: Number(dto.hadiahId), appKey },
    });

    if (!hadiah) {
      throw new NotFoundException('Hadiah tidak ditemukan');
    }

    if (hadiah.stok <= 0) {
      throw new BadRequestException('Stok hadiah ini sudah habis');
    }

    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id: nasabahId, appKey },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan');
    }

    if (nasabah.saldoPoin < hadiah.poinDibutuhkan) {
      throw new BadRequestException(
        `Saldo poin Anda (${nasabah.saldoPoin} poin) tidak mencukupi untuk menukar hadiah ini (${hadiah.poinDibutuhkan} poin).`,
      );
    }

    const kodePenukaran = `TKR-${Date.now()}`;

    return await this.prisma.$transaction(async (tx) => {
      const updatedNasabah = await tx.nasabah.update({
        where: { id: nasabahId },
        data: { saldoPoin: { decrement: hadiah.poinDibutuhkan } },
      });

      await tx.hadiah.update({
        where: { id: hadiah.id },
        data: { stok: { decrement: 1 } },
      });

      const penukaran = await tx.penukaranPoin.create({
        data: {
          kodePenukaran,
          tanggal: new Date(),
          poinTerpakai: hadiah.poinDibutuhkan,
          status: 'DIPROSES',
          nasabahId,
          hadiahId: hadiah.id,
          appKey,
        },
        include: {
          hadiah: true,
        },
      });

      return {
        ...penukaran,
        sisaSaldoPoin: updatedNasabah.saldoPoin,
      };
    });
  }

  async findMyPenukaran(nasabahId: number, appKey: string) {
    return await this.prisma.penukaranPoin.findMany({
      where: { nasabahId, appKey },
      orderBy: { tanggal: 'desc' },
      include: {
        hadiah: true,
      },
    });
  }

  async findAllAdmin(appKey: string, bulan?: string) {
    const where: any = { appKey };

    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      where.tanggal = { gte: startDate, lt: endDate };
    }

    return await this.prisma.penukaranPoin.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      include: {
        nasabah: true,
        hadiah: true,
      },
    });
  }

  async updateStatus(id: number, dto: UpdateStatusPenukaranDto, appKey: string) {
    const penukaran = await this.prisma.penukaranPoin.findFirst({
      where: { id, appKey },
    });

    if (!penukaran) {
      throw new NotFoundException('Data penukaran poin tidak ditemukan');
    }

    const statusMap: Record<string, 'DIPROSES' | 'SELESAI'> = {
      diproses: 'DIPROSES',
      selesai: 'SELESAI',
    };
    const statusBaru = statusMap[dto.status];

    return await this.prisma.penukaranPoin.update({
      where: { id },
      data: { status: statusBaru },
    });
  }

  async findNota(id: number, appKey: string, user: any) {
    const penukaran = await this.prisma.penukaranPoin.findFirst({
      where: { id, appKey },
      include: {
        nasabah: true,
        hadiah: true,
      },
    });

    if (!penukaran) {
      throw new NotFoundException('Data penukaran poin tidak ditemukan');
    }

    if (user.role === 'NASABAH' && penukaran.nasabahId !== user.nasabah.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke nota transaksi ini');
    }

    return penukaran;
  }
}