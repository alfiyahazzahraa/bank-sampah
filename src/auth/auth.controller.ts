import { Controller, Post, Get, Body, UseGuards, Request, UseInterceptors, UploadedFile,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterNasabahDto } from './dto/register-nasabah.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { imageUploadOptions } from '../common/helpers/file-upload.helper';

@ApiTags('Auth')
@ApiHeader({ name: 'x-app-key', required: true, description: 'App Key milik siswa' })
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrasi akun Nasabah baru' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AppKeyGuard)
  @Post('nasabah/register')
  @UseInterceptors(FileInterceptor('foto', imageUploadOptions))
  async registerNasabah(
    @Body() dto: RegisterNasabahDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const fotoPath = file ? `/uploads/${file.filename}` : undefined;
    return this.authService.registerNasabah(
      dto,
      req.appMaker.appKey,
      fotoPath,
    );
  }

  @ApiOperation({ summary: 'Pendaftaran unit Admin Bank Sampah baru' })
  @UseGuards(AppKeyGuard)
  @Post('admin/register')
  async registerAdmin(@Body() dto: RegisterAdminDto, @Request() req: any) {
    return this.authService.registerAdmin(dto, req.appMaker.appKey);
  }

  @ApiOperation({ summary: 'Login akun (Nasabah maupun Admin)' })
  @UseGuards(AppKeyGuard)
  @Post('login')
  async login(@Body() dto: LoginDto, @Request() req: any) {
    return this.authService.login(dto, req.appMaker.appKey);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cek profil & role user yang sedang login' })
  @UseGuards(AppKeyGuard, AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }
}