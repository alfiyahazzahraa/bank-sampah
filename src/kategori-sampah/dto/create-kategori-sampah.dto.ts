import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JenisSampah } from '@prisma/client';

export class CreateKategoriSampahDto {
  @IsString()
  @IsNotEmpty()
  namaKategori: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hargaPerKg: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  poinPerKg: number;

  @IsEnum(JenisSampah)
  @IsNotEmpty()
  jenis: JenisSampah;

  @IsString()
  @IsOptional()
  foto?: string;
}