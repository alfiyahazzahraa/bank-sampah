import { Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SetorSampahService } from './setor-sampah.service';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto';
import { VerifySetorDto } from './dto/verify-setor.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/v1/setor-sampah')
@UseGuards(AppKeyGuard, AuthGuard('jwt'), RolesGuard)
export class SetorSampahController {
  constructor(private readonly setorSampahService: SetorSampahService) {}

  @Post('pengajuan')
  @Roles('NASABAH')
  async create(
    @Body() dto: CreateSetorSampahDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    const nasabahId = req.user.nasabah.id;
    const result = await this.setorSampahService.create(dto, nasabahId, appKey);
    return {
      statusCode: 201,
      success: true,
      message: 'Pengajuan penyetoran sampah berhasil dibuat',
      data: result,
    };
  }

  @Get('my-setor')
  @Roles('NASABAH')
  async findMySetor(
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan?: string,
  ) {
    const nasabahId = req.user.nasabah.id;
    const result = await this.setorSampahService.findMySetor(nasabahId, appKey, bulan);
    return {
      statusCode: 200,
      success: true,
      message: 'Histori pengajuan penyetoran sampah berhasil diambil',
      data: result,
    };
  }

  @Get('admin/list')
  @Roles('ADMIN')
  async findAllAdmin(
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.setorSampahService.findAllAdmin(appKey, bulan, status);
    return {
      statusCode: 200,
      success: true,
      message: 'Seluruh data pengajuan penyetoran sampah berhasil diambil',
      data: result,
    };
  }

  @Put('admin/verify/:id')
  @Roles('ADMIN')
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifySetorDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    const adminBankId = req.user.adminBank.id;
    const result = await this.setorSampahService.verify(id, dto, adminBankId, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Verifikasi penyetoran sampah berhasil disimpan dan poin nasabah telah diperbarui',
      data: result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-app-key') appKey: string,
  ) {
    const result = await this.setorSampahService.findOne(id, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Detail transaksi penyetoran sampah berhasil diambil',
      data: result,
    };
  }
}