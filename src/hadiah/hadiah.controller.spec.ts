import { Test, TestingModule } from '@nestjs/testing';
import { HadiahController } from './hadiah.controller';
import { HadiahService } from './hadiah.service';

describe('HadiahController', () => {
  let controller: HadiahController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HadiahController],
      providers: [HadiahService],
    }).compile();

    controller = module.get<HadiahController>(HadiahController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
