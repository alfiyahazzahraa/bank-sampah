import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto';

@Injectable()
export class KategoriSampahService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKategoriSampahDto, appKey: string) {
    const kategori = await this.prisma.kategoriSampah.create({
      data: {
        ...dto,
        appKey,
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Kategori sampah baru berhasil disimpan',
      data: kategori,
    };
  }

  async findAll(appKey: string) {
    const data = await this.prisma.kategoriSampah.findMany({
      where: { appKey },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Daftar kategori sampah daur ulang berhasil diambil',
      data,
    };
  }

  async findOne(id: number, appKey: string) {
    const kategori = await this.prisma.kategoriSampah.findFirst({
      where: { id, appKey },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori sampah tidak ditemukan.');
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Detail kategori sampah berhasil diambil',
      data: kategori,
    };
  }

  async update(id: number, dto: UpdateKategoriSampahDto, appKey: string) {
    await this.findOne(id, appKey);

    const updated = await this.prisma.kategoriSampah.update({
      where: { id },
      data: dto,
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Kategori sampah berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number, appKey: string) {
    await this.findOne(id, appKey);

    await this.prisma.kategoriSampah.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Kategori sampah berhasil dihapus',
      data: { id },
    };
  }
}