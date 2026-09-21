import { Module } from '@nestjs/common';
import { RekapitulasiService } from './rekapitulasi.service';
import { RekapitulasiController } from './rekapitulasi.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RekapitulasiController],
  providers: [RekapitulasiService],
})
export class RekapitulasiModule {}