import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppMakerModule } from './app-maker/app-maker.module';
import { AuthModule } from './auth/auth.module';
import { KategoriSampahModule } from './kategori-sampah/kategori-sampah.module';
import { HadiahModule } from './hadiah/hadiah.module';
import { SetorSampahModule } from './setor-sampah/setor-sampah.module';
import { NasabahModule } from './nasabah/nasabah.module';
import { PenukaranPoinModule } from './penukaran-poin/penukaran-poin.module';
import { SeedModule } from './seed/seed.module';
import { RekapitulasiModule } from './rekapitulasi/rekapitulasi.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, AppMakerModule, AuthModule, KategoriSampahModule, HadiahModule, SetorSampahModule, NasabahModule, PenukaranPoinModule, SeedModule, RekapitulasiModule, DashboardModule],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService],
})
export class AppModule {}