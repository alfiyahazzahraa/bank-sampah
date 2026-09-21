import { BadRequestException, Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Request, UseGuards, UseInterceptors,UploadedFile,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { imageUploadOptions } from '../common/helpers/file-upload.helper';

@Controller('api/v1/admin/nasabah')
@UseGuards(AppKeyGuard, AuthGuard('jwt'))
export class NasabahController {
  constructor(private readonly nasabahService: NasabahService) {}

  @Get()
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

  // 👇 FIX: tambah FileInterceptor supaya foto benar-benar tersambung ke service
  @Post()
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  async create(
    @Body() dto: CreateNasabahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat menambah data nasabah');
    }

    const fotoPath = file ? `/uploads/${file.filename}` : undefined;
    const result = await this.nasabahService.create(dto, appKey, fotoPath);
    return {
      statusCode: 201,
      success: true,
      message: 'Nasabah baru berhasil ditambahkan',
      data: result,
    };
  }

  @Get(':id')
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

  // 👇 FIX: sama, tambah FileInterceptor di update juga
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNasabahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Headers('x-app-key') appKey: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Hanya Admin yang dapat mengubah data nasabah');
    }

    const fotoPath = file ? `/uploads/${file.filename}` : undefined;
    const result = await this.nasabahService.update(id, dto, appKey, fotoPath);
    return {
      statusCode: 200,
      success: true,
      message: 'Data nasabah berhasil diperbarui',
      data: result,
    };
  }

  @Delete(':id')
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