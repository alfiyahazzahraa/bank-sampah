import { BadRequestException, Controller, Get, Headers, Query, Request, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RekapitulasiService } from './rekapitulasi.service';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@Controller('api/v1/rekapitulasi')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class RekapitulasiController {
  constructor(private readonly rekapitulasiService: RekapitulasiService) {}

  @Get('bulanan')
  async bulanan(
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengakses rekapitulasi');
    }

    const result = await this.rekapitulasiService.bulanan(appKey, bulan);
    return {
      statusCode: 200,
      success: true,
      message: `Rekapitulasi Bank Sampah Bulan ${bulan} berhasil diambil`,
      data: result,
    };
  }
}