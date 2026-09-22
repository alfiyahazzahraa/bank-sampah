import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { JenisSampah } from '@prisma/client';

export class UpdateKategoriSampahDto {
  @ApiPropertyOptional({ example: 'Botol Plastik PET Bersih' })
  @IsOptional()
  @IsString()
  namaKategori?: string;

  @ApiPropertyOptional({ example: 4000 })
  @IsOptional()
  @IsNumber()
  hargaPerKg?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
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