import { Test, TestingModule } from '@nestjs/testing';
import { PenukaranPoinController } from './penukaran-poin.controller';
import { PenukaranPoinService } from './penukaran-poin.service';

describe('PenukaranPoinController', () => {
  let controller: PenukaranPoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenukaranPoinController],
      providers: [PenukaranPoinService],
    }).compile();

    controller = module.get<PenukaranPoinController>(PenukaranPoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
