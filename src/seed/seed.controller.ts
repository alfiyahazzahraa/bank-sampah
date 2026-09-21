import { Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AppKeyGuard } from '../common/guards/app-key.guard';

@Controller('api/v1/seed')
@UseGuards(AppKeyGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async generate(@Headers('x-app-key') appKey: string) {
    const result = await this.seedService.generate(appKey);
    return {
      statusCode: 201,
      success: true,
      message: 'Dummy sample data Bank Sampah berhasil dibuat!',
      data: result,
    };
  }
}