import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNasabahDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alamat?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  noTelepon?: string;

  @IsOptional()
  @IsDateString()
  tanggalLahir?: string;
}