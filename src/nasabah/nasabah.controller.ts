import { BadRequestException, Body,Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@ApiTags('Admin - CRUD Nasabah')
@ApiBearerAuth()
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/admin/nasabah')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class NasabahController {
  constructor(private readonly nasabahService: NasabahService) {}

  @Get()
  @ApiOperation({ summary: 'Admin melihat semua data nasabah' })
  async findAll(@Request() req: any, @Headers('x-app-key') appKey: string) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengakses data ini');
    }

    const result = await this.nasabahService.findAll(appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar nasabah berhasil diambil',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Admin menambah data nasabah baru' })
  async create(
    @Body() dto: CreateNasabahDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat menambah data nasabah');
    }

    const result = await this.nasabahService.create(dto, appKey);
    return {
      statusCode: 201,
      success: true,
      message: 'Nasabah baru berhasil ditambahkan',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin melihat detail satu nasabah' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengakses data ini');
    }

    const result = await this.nasabahService.findOne(id, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Detail nasabah berhasil diambil',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Admin mengubah data nasabah' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNasabahDto,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengubah data nasabah');
    }

    const result = await this.nasabahService.update(id, dto, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Data nasabah berhasil diperbarui',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin menghapus data nasabah' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat menghapus data nasabah');
    }

    const result = await this.nasabahService.remove(id, appKey);
    return {
      statusCode: 200,
      success: true,
      message: 'Data nasabah berhasil dihapus',
      data: result,
    };
  }
}