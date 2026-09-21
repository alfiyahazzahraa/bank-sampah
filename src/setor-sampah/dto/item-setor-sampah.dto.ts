import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemSetorDto {
  @IsString()
  @IsNotEmpty()
  kategoriSampahId: string; 

  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  beratKg: number;
}