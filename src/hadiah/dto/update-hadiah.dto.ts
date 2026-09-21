import { PartialType } from '@nestjs/mapped-types';
import { CreateHadiahDto } from './create-hadiah.dto';

export class UpdateHadiahDto extends PartialType(CreateHadiahDto) {}