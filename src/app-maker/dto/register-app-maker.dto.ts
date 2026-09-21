import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAppMakerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  namaSiswa: string;

  @IsNotEmpty()
  @IsString()
  kelas: string;

  @IsNotEmpty()
  @IsString()
  namaApp: string;
}