import { Module } from '@nestjs/common';
import { PenukaranPoinService } from './penukaran-poin.service';
import { PenukaranPoinController } from './penukaran-poin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PenukaranPoinController],
  providers: [PenukaranPoinService],
})
export class PenukaranPoinModule {}