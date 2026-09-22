import { BadRequestException, Controller, Get, Headers, Query, Request, UseGuards,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RekapitulasiService } from './rekapitulasi.service';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@ApiTags('Rekapitulasi')
@ApiBearerAuth()
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/rekapitulasi')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class RekapitulasiController {
  constructor(private readonly rekapitulasiService: RekapitulasiService) {}

  @Get('bulanan')
  @ApiOperation({ summary: 'Admin melihat rekapitulasi tonase & pembayaran per bulan' })
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