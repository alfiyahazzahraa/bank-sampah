import { BadRequestException, Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@ApiTags('Dashboard')
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Nasabah melihat ringkasan saldo & transaksi terakhir' })
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  async summary(@Request() req: any, @Headers('x-app-key') appKey: string) {
    if (req.user.role !== 'NASABAH') {
      throw new BadRequestException('Hanya Nasabah yang dapat mengakses dashboard ini');
    }

    const nasabahId = req.user.nasabah.id;
    const result = await this.dashboardService.summary(nasabahId, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Summary dashboard nasabah berhasil diambil',
      data: result,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistik umum Bank Sampah (cukup x-app-key, tanpa login)' })
  @UseGuards(AppKeyGuard)
  async stats(@Headers('x-app-key') appKey: string) {
    const result = await this.dashboardService.stats(appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Statistik dashboard Bank Sampah milik App Maker',
      data: result,
    };
  }
}