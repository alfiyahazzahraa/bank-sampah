import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreateHadiahDto {
  @IsString()
  @IsNotEmpty()
  namaHadiah: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @Type(() => Number) 
  @IsNumber()
  @Min(0)
  poinDibutuhkan: number;

  @Type(() => Number) 
  @IsNumber()
  @Min(0)
  stok: number;

  @IsString()
  @IsOptional()
  foto?: string;
}