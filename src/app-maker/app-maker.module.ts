import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppMakerController } from './app-maker.controller';
import { AppMakerService } from './app-maker.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'rahasia-ukk-bank-sampah',   
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppMakerController],
  providers: [AppMakerService],
})
export class AppMakerModule {}