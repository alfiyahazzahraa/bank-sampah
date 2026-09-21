import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppMakerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterAppMakerDto) {
    const existing = await this.prisma.appMaker.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar sebagai App Maker.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const appKey = uuidv4();

    const newAppMaker = await this.prisma.appMaker.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        namaSiswa: dto.namaSiswa,
        kelas: dto.kelas,
        namaApp: dto.namaApp,
        appKey: appKey,
      },
    });

    const payload = {
      sub: newAppMaker.id,
      email: newAppMaker.email,
      type: 'APP_MAKER',
    };
    const token = this.jwtService.sign(payload);

    const { password, ...result } = newAppMaker;

    return {
      statusCode: 201,
      success: true,
      message:
        'Registrasi App Maker berhasil! Simpan appKey berikut untuk dimasukkan di header x-app-key pada setiap request API frontend.',
      data: {
        ...result,
        token,
      },
    };
  }

  async login(dto: LoginAppMakerDto) {
    const appMaker = await this.prisma.appMaker.findUnique({
      where: { email: dto.email },
    });
    if (!appMaker) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      appMaker.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const payload = {
      sub: appMaker.id,
      email: appMaker.email,
      type: 'APP_MAKER',
    };
    const token = this.jwtService.sign(payload);

    const { password, ...result } = appMaker;

    return {
      statusCode: 200,
      success: true,
      message: 'Login App Maker berhasil',
      data: {
        ...result,
        token,
      },
    };
  }

  async checkKey(email: string) {
    if (!email) {
      throw new NotFoundException(
        'Akun App Maker dengan email tersebut tidak ditemukan.',
      );
    }

    const appMaker = await this.prisma.appMaker.findUnique({
      where: { email },
    });

    if (!appMaker) {
      throw new NotFoundException(
        'Akun App Maker dengan email tersebut tidak ditemukan.',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: 'App Key ditemukan',
      data: {
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
      },
    };
  }

  async getProfile(appMaker: { id: number; appKey: string; email: string; namaSiswa: string; kelas: string; namaApp: string; createdAt: Date }) {
    const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah] =
      await Promise.all([
        this.prisma.nasabah.count({ where: { appKey: appMaker.appKey } }),
        this.prisma.kategoriSampah.count({ where: { appKey: appMaker.appKey } }),
        this.prisma.setorSampah.count({ where: { appKey: appMaker.appKey } }),
        this.prisma.hadiah.count({ where: { appKey: appMaker.appKey } }),
      ]);

    return {
      statusCode: 200,
      success: true,
      message: 'Data profile App Maker berhasil diambil',
      data: {
        id: appMaker.id,
        email: appMaker.email,
        namaSiswa: appMaker.namaSiswa,
        kelas: appMaker.kelas,
        namaApp: appMaker.namaApp,
        appKey: appMaker.appKey,
        stats: {
          totalNasabah,
          totalKategoriSampah,
          totalTransaksiSetor,
          totalHadiah,
        },
      },
    };
  }
}