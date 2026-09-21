import { BadRequestException, Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PenukaranPoinService } from './penukaran-poin.service';
import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto';
import { UpdateStatusPenukaranDto } from './dto/update-penukaran-poin.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@Controller('api/v1/penukaran-poin')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class PenukaranPoinController {
  constructor(private readonly penukaranPoinService: PenukaranPoinService) {}

  @Post('tukar')
  async tukar(
    @Body() dto: CreatePenukaranPoinDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'NASABAH') {
      throw new BadRequestException('Hanya Nasabah yang dapat menukar poin');
    }

    const nasabahId = req.user.nasabah.id;
    const result = await this.penukaranPoinService.tukar(dto, nasabahId, appKey);
    return {
      statusCode: 201,
      success: true,
      message: 'Penukaran poin berhasil diajukan',
      data: result,
    };
  }

  @Get('my-penukaran')
  async findMyPenukaran(@Request() req: any, @Headers('x-app-key') appKey: string) {
    if (req.user.role !== 'NASABAH') {
      throw new BadRequestException('Hanya Nasabah yang dapat mengakses histori ini');
    }

    const nasabahId = req.user.nasabah.id;
    const result = await this.penukaranPoinService.findMyPenukaran(nasabahId, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Histori penukaran poin nasabah berhasil diambil',
      data: result,
    };
  }

  @Get('admin/list')
  async findAllAdmin(
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan?: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengakses data ini');
    }

    const result = await this.penukaranPoinService.findAllAdmin(appKey, bulan);
    return {
      statusCode: 200,
      success: true,
      message: 'Seluruh data transaksi penukaran poin berhasil diambil',
      data: result,
    };
  }

  @Put('admin/status/:id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusPenukaranDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengubah status penukaran poin');
    }

    const result = await this.penukaranPoinService.updateStatus(id, dto, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Status transaksi penukaran poin berhasil diperbarui',
      data: result,
    };
  }

  @Get('nota/:id')
  async findNota(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    const result = await this.penukaranPoinService.findNota(id, appKey, req.user);
    return {
      statusCode: 200,
      success: true,
      message: 'Struk nota penukaran poin berhasil diambil',
      data: result,
    };
  }
}