import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppMakerService } from './app-maker.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@Controller('api/v1/maker')
export class AppMakerController {
  constructor(private readonly appMakerService: AppMakerService) {}

  @Post('register')
  register(@Body() dto: RegisterAppMakerDto) {
    return this.appMakerService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAppMakerDto) {
    return this.appMakerService.login(dto);
  }

  @Get('check-key')
  checkKey(@Query('email') email: string) {
    return this.appMakerService.checkKey(email);
  }

  @UseGuards(AppKeyGuard)
  @Get('profile')
  getProfile(@Req() request: Request & { appMaker: any }) {
    return this.appMakerService.getProfile(request.appMaker);
  }
}