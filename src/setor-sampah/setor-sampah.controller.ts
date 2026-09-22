import { BadRequestException, Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { SetorSampahService } from './setor-sampah.service';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto';
import { VerifySetorDto } from './dto/verify-setor.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@ApiTags('Setor Sampah')
@ApiBearerAuth()
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/setor-sampah')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class SetorSampahController {
  constructor(private readonly setorSampahService: SetorSampahService) {}

  @Post('pengajuan')
  @ApiOperation({ summary: 'Nasabah mengajukan penyetoran sampah' })
  async create(
    @Body() dto: CreateSetorSampahDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'NASABAH') {
      throw new BadRequestException('Hanya Nasabah yang dapat mengajukan penyetoran sampah');
    }

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
  @ApiOperation({ summary: 'Nasabah melihat histori penyetoran miliknya sendiri' })
  async findMySetor(
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan?: string,
  ) {
    if (req.user.role !== 'NASABAH') {
      throw new BadRequestException('Hanya Nasabah yang dapat mengakses histori ini');
    }

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
  @ApiOperation({ summary: 'Admin melihat semua pengajuan penyetoran sampah' })
  async findAllAdmin(
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
    @Query('bulan') bulan?: string,
    @Query('status') status?: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengakses data ini');
    }

    const result = await this.setorSampahService.findAllAdmin(appKey, bulan, status);
    return {
      statusCode: 200,
      success: true,
      message: 'Seluruh data pengajuan penyetoran sampah berhasil diambil',
      data: result,
    };
  }

  @Put('admin/verify/:id')
  @ApiOperation({ summary: 'Admin memverifikasi & menimbang ulang penyetoran sampah' })
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifySetorDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat memverifikasi penyetoran sampah');
    }

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
  @ApiOperation({ summary: 'Nasabah/Admin melihat detail satu transaksi penyetoran' })
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