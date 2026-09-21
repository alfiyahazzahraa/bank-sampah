import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyItemSetorDto {
  @IsNumber()
  kategoriSampahId: number;

  @IsNumber()
  beratKgReal: number;
}

export class VerifySetorDto {
  @IsEnum(['diverifikasi', 'ditolak', 'selesai'])
  @IsNotEmpty()
  status: 'diverifikasi' | 'ditolak' | 'selesai';

  @IsOptional()
  @IsString()
  catatanAdmin?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifyItemSetorDto)
  itemsReal?: VerifyItemSetorDto[];
}