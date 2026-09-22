import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHadiahDto {
  @ApiProperty({ example: 'Minyak Goreng Bimoli 1 Liter' })
  @IsString()
  @IsNotEmpty()
  namaHadiah: string;

  @ApiPropertyOptional({ example: 'Minyak goreng kemasan botol 1 liter' })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  poinDibutuhkan: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsNumber()
  stok: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Foto hadiah' })
  @IsOptional()
  foto?: any;
}