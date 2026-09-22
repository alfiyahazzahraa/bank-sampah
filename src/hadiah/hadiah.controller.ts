import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { HadiahService } from './hadiah.service';
import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { imageUploadOptions } from '../common/helpers/file-upload.helper';

@ApiTags('Hadiah')
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/hadiah')
export class HadiahController {
  constructor(private readonly hadiahService: HadiahService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin menambah data hadiah baru' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  create(
    @Body() dto: CreateHadiahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (file) {
      dto.foto = `/uploads/${file.filename}`;
    }
    return this.hadiahService.create(dto, req.appMaker.appKey);
  }

  @ApiOperation({ summary: 'Nasabah/Admin melihat katalog hadiah' })
  @UseGuards(AppKeyGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.hadiahService.findAll(req.appMaker.appKey);
  }

  @ApiOperation({ summary: 'Nasabah/Admin melihat detail satu hadiah' })
  @UseGuards(AppKeyGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.hadiahService.findOne(id, req.appMaker.appKey);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin mengubah data hadiah' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHadiahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (file) {
      dto.foto = `/uploads/${file.filename}`;
    }
    return this.hadiahService.update(id, dto, req.appMaker.appKey);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin menghapus data hadiah' })
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.hadiahService.remove(id, req.appMaker.appKey);
  }
}