import { Test, TestingModule } from '@nestjs/testing';
import { HikesService } from './hikes.service';

describe('HikesService', () => {
  let service: HikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HikesService],
    }).compile();

    service = module.get<HikesService>(HikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
