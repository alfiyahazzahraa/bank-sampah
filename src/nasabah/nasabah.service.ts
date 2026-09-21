import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

@Injectable()
export class NasabahService {
  constructor(private prisma: PrismaService) {}

  async findAll(appKey: string) {
    const data = await this.prisma.nasabah.findMany({
      where: { appKey },
      include: {
        user: {
          select: { username: true, role: true },
        },
      },
    });

    return data.map((n) => ({
      id: n.id,
      namaNasabah: n.namaNasabah,
      alamat: n.alamat,
      telefon: n.telefon,
      saldoPoin: n.saldoPoin,
      foto: n.foto,
      user: n.user,
    }));
  }

  async findOne(id: number, appKey: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id, appKey },
      include: {
        user: {
          select: { username: true, role: true },
        },
      },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan');
    }

    return {
      id: nasabah.id,
      namaNasabah: nasabah.namaNasabah,
      alamat: nasabah.alamat,
      telefon: nasabah.telefon,
      saldoPoin: nasabah.saldoPoin,
      foto: nasabah.foto,
      user: nasabah.user,
    };
  }

  async create(dto: CreateNasabahDto, appKey: string, foto?: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: dto.username, appKey },
    });

    if (existingUser) {
      throw new BadRequestException('Username sudah digunakan pada database aplikasi Anda.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashedPassword,
          role: 'NASABAH',
          appKey,
        },
      });

      const nasabah = await tx.nasabah.create({
        data: {
          namaNasabah: dto.namaNasabah,
          alamat: dto.alamat,
          telefon: dto.telp,
          saldoPoin: 0,
          userId: user.id,
          appKey,
          foto,
        },
      });

      return { user, nasabah };
    });

    return {
      id: result.user.id,
      username: result.user.username,
      role: result.user.role,
      nasabah: result.nasabah,
    };
  }

  async update(id: number, dto: UpdateNasabahDto, appKey: string, foto?: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id, appKey },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan');
    }

    const updated = await this.prisma.nasabah.update({
      where: { id },
      data: {
        ...(dto.namaLengkap ? { namaNasabah: dto.namaLengkap } : {}),
        ...(dto.alamat ? { alamat: dto.alamat } : {}),
        ...(dto.noTelepon ? { telefon: dto.noTelepon } : {}),
        ...(dto.tanggalLahir ? { tanggalLahir: new Date(dto.tanggalLahir) } : {}),
        ...(foto ? { foto } : {}),
      },
    });

    return {
      id: updated.id,
      namaNasabah: updated.namaNasabah,
      alamat: updated.alamat,
      telefon: updated.telefon,
      saldoPoin: updated.saldoPoin,
      foto: updated.foto,
      tanggalLahir: updated.tanggalLahir,
    };
  }

  async remove(id: number, appKey: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: { id, appKey },
    });

    if (!nasabah) {
      throw new NotFoundException('Data nasabah tidak ditemukan');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.nasabah.delete({ where: { id } });
      await tx.user.delete({ where: { id: nasabah.userId } });
    });

    return { id };
  }
}