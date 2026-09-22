import { IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterNasabahDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsString()
  @IsNotEmpty()
  namaNasabah: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsString()
  @IsNotEmpty()
  telp: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggalLahir harus YYYY-MM-DD (ISO 8601)' })
  tanggalLahir?: string;
}