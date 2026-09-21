import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePenukaranPoinDto {
  @IsNumber()
  @IsNotEmpty()
  hadiahId: number;
}