import { IsArray, IsDateString, IsOptional, IsString, ValidateNested, ArrayMinSize} from 'class-validator';
import { Type } from 'class-transformer';
import { ItemSetorDto } from './item-setor-sampah.dto';

export class CreateSetorSampahDto {
  @IsDateString()
  tanggal: string;

  @IsString()
  @IsOptional()
  catatan?: string;


  @IsArray()
  @ArrayMinSize(1) 
  @ValidateNested({ each: true }) 
  @Type(() => ItemSetorDto)
  items: ItemSetorDto[];
}