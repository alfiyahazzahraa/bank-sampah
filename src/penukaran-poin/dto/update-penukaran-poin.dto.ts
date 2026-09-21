import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusPenukaranDto {
  @IsEnum(['diproses', 'selesai'])
  @IsNotEmpty()
  status: 'diproses' | 'selesai';
}