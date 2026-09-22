import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHadiahDto {
  @ApiPropertyOptional({ example: 'Minyak Goreng Bimoli 2 Liter' })
  @IsOptional()
  @IsString()
  namaHadiah?: string;

  @ApiPropertyOptional({ example: 'Minyak goreng kemasan botol 2 liter' })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  poinDibutuhkan?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stok?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Foto hadiah' })
  @IsOptional()
  foto?: any;
}