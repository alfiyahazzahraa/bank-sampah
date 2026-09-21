import { Test, TestingModule } from '@nestjs/testing';
import { AppMakerController } from './app-maker.controller';

describe('AppMakerController', () => {
  let controller: AppMakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppMakerController],
    }).compile();

    controller = module.get<AppMakerController>(AppMakerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
