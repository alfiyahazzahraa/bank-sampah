import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { JenisSampah } from '@prisma/client';

export class UpdateKategoriSampahDto {
  @ApiPropertyOptional({ example: 'Botol Plastik PET Bersih' })
  @IsOptional()
  @IsString()
  namaKategori?: string;

  @ApiPropertyOptional({ example: 4000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hargaPerKg?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  poinPerKg?: number;

  @ApiPropertyOptional({ enum: JenisSampah })
  @IsOptional()
  @IsEnum(JenisSampah)
  jenis?: JenisSampah;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Foto kategori sampah' })
  @IsOptional()
  foto?: any;
}