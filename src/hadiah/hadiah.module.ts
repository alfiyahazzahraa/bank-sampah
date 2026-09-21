import { Module } from '@nestjs/common';
import { HadiahService } from './hadiah.service';
import { HadiahController } from './hadiah.controller';
import { PrismaModule } from '../prisma/prisma.module';   

@Module({
  imports: [PrismaModule],
  controllers: [HadiahController],
  providers: [HadiahService],
})
export class HadiahModule {}