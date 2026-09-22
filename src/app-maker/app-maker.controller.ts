import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { AppMakerService } from './app-maker.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@ApiTags('App Maker')
@Controller('api/v1/maker')
export class AppMakerController {
  constructor(private readonly appMakerService: AppMakerService) {}

  @ApiOperation({ summary: 'Registrasi akun siswa untuk mendapatkan appKey' })
  @Post('register')
  register(@Body() dto: RegisterAppMakerDto) {
    return this.appMakerService.register(dto);
  }

  @ApiOperation({ summary: 'Login akun siswa (App Maker)' })
  @Post('login')
  login(@Body() dto: LoginAppMakerDto) {
    return this.appMakerService.login(dto);
  }

  @ApiOperation({ summary: 'Cek/cari appKey berdasarkan email siswa' })
  @Get('check-key')
  checkKey(@Query('email') email: string) {
    return this.appMakerService.checkKey(email);
  }

  @ApiOperation({ summary: 'Profil siswa & statistik keseluruhan data' })
  @ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
  @UseGuards(AppKeyGuard)
  @Get('profile')
  getProfile(@Req() request: Request & { appMaker: any }) {
    return this.appMakerService.getProfile(request.appMaker);
  }
}