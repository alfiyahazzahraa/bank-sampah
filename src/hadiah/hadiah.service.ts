import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';

@Injectable()
export class HadiahService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHadiahDto, appKey: string) {
    const hadiah = await this.prisma.hadiah.create({
      data: {
        namaHadiah: dto.namaHadiah,
        deskripsi: dto.deskripsi,
        poinDibutuhkan: Number(dto.poinDibutuhkan),
        stok: Number(dto.stok),
        foto: dto.foto,
        appKey,
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Hadiah baru berhasil ditambahkan',
      data: hadiah,
    };
  }

  async findAll(appKey: string) {
    const data = await this.prisma.hadiah.findMany({
      where: { appKey },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Daftar barang/voucher hadiah berhasil diambil',
      data,
    };
  }

  async findOne(id: number, appKey: string) {
    const hadiah = await this.prisma.hadiah.findFirst({
      where: { id, appKey },
    });

    if (!hadiah) {
      throw new NotFoundException('Hadiah tidak ditemukan.');
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Detail hadiah berhasil diambil',
      data: hadiah,
    };
  }

  async update(id: number, dto: UpdateHadiahDto, appKey: string) {
    await this.findOne(id, appKey);

    const dataToUpdate: any = { ...dto };
    if (dto.poinDibutuhkan) dataToUpdate.poinDibutuhkan = Number(dto.poinDibutuhkan);
    if (dto.stok) dataToUpdate.stok = Number(dto.stok);

    const updated = await this.prisma.hadiah.update({
      where: { id },
      data: dataToUpdate,
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Data hadiah berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number, appKey: string) {
    await this.findOne(id, appKey);

    await this.prisma.hadiah.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Hadiah berhasil dihapus',
      data: { id },
    };
  }
}