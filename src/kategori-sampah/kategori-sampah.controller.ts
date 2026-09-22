import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, Request} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { KategoriSampahService } from './kategori-sampah.service';
import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { imageUploadOptions } from '../common/helpers/file-upload.helper';

@ApiTags('Kategori Sampah')
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/kategori-sampah')
export class KategoriSampahController {
  constructor(private readonly kategoriSampahService: KategoriSampahService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin menambah kategori sampah baru' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  create(
    @Body() dto: CreateKategoriSampahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (file) {
      dto.foto = `/uploads/${file.filename}`;
    }
    if (dto.hargaPerKg) dto.hargaPerKg = Number(dto.hargaPerKg);
    if (dto.poinPerKg) dto.poinPerKg = Number(dto.poinPerKg);

    return this.kategoriSampahService.create(dto, req.appMaker.appKey);
  }

  @ApiOperation({ summary: 'Nasabah/Admin melihat daftar kategori sampah' })
  @UseGuards(AppKeyGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.kategoriSampahService.findAll(req.appMaker.appKey);
  }

  @ApiOperation({ summary: 'Nasabah/Admin melihat detail satu kategori sampah' })
  @UseGuards(AppKeyGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.kategoriSampahService.findOne(id, req.appMaker.appKey);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin mengubah data kategori sampah' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKategoriSampahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (file) {
      dto.foto = `/uploads/${file.filename}`;
    }
    if (dto.hargaPerKg) dto.hargaPerKg = Number(dto.hargaPerKg);
    if (dto.poinPerKg) dto.poinPerKg = Number(dto.poinPerKg);

    return this.kategoriSampahService.update(id, dto, req.appMaker.appKey);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin menghapus kategori sampah' })
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.kategoriSampahService.remove(id, req.appMaker.appKey);
  }
}