import { Test, TestingModule } from '@nestjs/testing';
import { KategoriSampahController } from './kategori-sampah.controller';
import { KategoriSampahService } from './kategori-sampah.service';

describe('KategoriSampahController', () => {
  let controller: KategoriSampahController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KategoriSampahController],
      providers: [KategoriSampahService],
    }).compile();

    controller = module.get<KategoriSampahController>(KategoriSampahController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
