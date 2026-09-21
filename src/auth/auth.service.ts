import { Injectable, BadRequestException, UnauthorizedException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterNasabahDto } from './dto/register-nasabah.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerNasabah(
    dto: RegisterNasabahDto,
    appKey: string,
    foto?: string,
  ) {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: dto.username, appKey },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
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
      statusCode: 201,
      success: true,
      message: 'Registrasi nasabah berhasil',
      data: {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
        nasabah: result.nasabah,
      },
    };
  }

  async registerAdmin(dto: RegisterAdminDto, appKey: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: dto.username, appKey },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashedPassword,
          role: 'ADMIN',
          appKey,
        },
      });

      const adminBank = await tx.adminBank.create({
        data: {
          namaUnit: dto.namaUnit,
          namaPengelola: dto.namaPengelola,
          telefon: dto.telp, 
          userId: user.id,
          appKey,
        },
      });

      return { user, adminBank };
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Pendaftaran unit Bank Sampah berhasil',
      data: {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
        adminBank: result.adminBank,
      },
    };
  }

  async login(dto: LoginDto, appKey: string) {
    const user = await this.prisma.user.findFirst({
      where: { username: dto.username, appKey },
      include: { nasabah: true, adminBank: true },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      appKey,
    };
    const token = this.jwtService.sign(payload);

    return {
      statusCode: 201,
      success: true,
      message: `Login ${user.role} berhasil`,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nasabah: user.nasabah,
        adminBank: user.adminBank,
        token,
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { nasabah: true, adminBank: true },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Data profile user berhasil diambil',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nasabah: user.nasabah,
        adminBank: user.adminBank,
      },
    };
  }
}