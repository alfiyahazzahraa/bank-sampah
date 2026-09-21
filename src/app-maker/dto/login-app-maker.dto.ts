import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAppMakerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}