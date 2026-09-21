import { Test, TestingModule } from '@nestjs/testing';
import { AppMakerService } from './app-maker.service';

describe('AppMakerService', () => {
  let service: AppMakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppMakerService],
    }).compile();

    service = module.get<AppMakerService>(AppMakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
