import { Module } from '@nestjs/common';
import { KategoriSampahService } from './kategori-sampah.service';
import { KategoriSampahController } from './kategori-sampah.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KategoriSampahController],
  providers: [KategoriSampahService],
})
export class KategoriSampahModule {}