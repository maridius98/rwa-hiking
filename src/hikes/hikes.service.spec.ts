import { Test, TestingModule } from '@nestjs/testing';
import { HikesService } from './hikes.service';
import { RegionService } from 'src/region/region.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hike } from './hikes.entity';
import { BadRequestException } from '@nestjs/common';

describe('HikesService', () => {
  let service: HikesService;
  let mockHikeRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };
  let mockRegionService = {};
  let mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          HikesService,
          {
              provide: getRepositoryToken(Hike),
              useValue: mockHikeRepository,
          },
          {
              provide: RegionService,
              useValue: mockRegionService,
          },
          {
              provide: UsersService,
              useValue: mockUsersService,
          }
      ],
    }).compile();

    service = module.get<HikesService>(HikesService);
  });

  it('should calculate "Extreme" difficulty for a hike with extreme factor', () => {
    const hike = {
      distance: 16000,
      elevationGain: 1000
    };
    const difficulty = service.calculateDifficulty(hike as Hike);
    expect(difficulty).toEqual("Extreme");
  });

  it('should calculate "Hard" difficulty for a hike with hard factor', () => {
    const hike = {
      distance: 12000,
      elevationGain: 1000
    };
    const difficulty = service.calculateDifficulty(hike as Hike);
    expect(difficulty).toEqual("Hard");
  });

  it('should calculate "Medium" difficulty for a hike with medium factor', () => {
    const hike = {
      distance: 12000,
      elevationGain: 600
    };
    const difficulty = service.calculateDifficulty(hike as Hike);
    expect(difficulty).toEqual("Medium");
  });

  it('should calculate "Easy" difficulty for a hike with easy factor', () => {
    const hike = {
      distance: 8000,
      elevationGain: 600
    };
    const difficulty = service.calculateDifficulty(hike as Hike);
    expect(difficulty).toEqual("Easy");
  });

  it('should parse comparison parameters for distance filter', () => {
    const inputString = 'GT_1000.LT_5000';
    const result = service.parseComparisonFilter(inputString);
    expect(result).toEqual([
      { queryOperator: '>', queryValue: 1000 },
      { queryOperator: '<', queryValue: 5000 },
    ]);
  });

  it('should throw an error with wrong separator', async () => {
    const inputString = 'GT_1000$LT_5000';
    try {
      service.parseComparisonFilter(inputString);
      fail('Expected an error to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw an error with negative value', async () => {
    const inputString = 'GT_-1000';
    try {
      service.parseComparisonFilter(inputString);
      fail('Expected an error to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
  
  it('should handle single comparison parameter', () => {
    const inputString = 'LT_2000';
    const result = service.parseComparisonFilter(inputString);
    expect(result).toEqual([{ queryOperator: '<', queryValue: 2000 }]);
  });

  it('should parse a valid query string', () => {
    const queryString = 'difficulty=Hard&distance=GT_1000.LT_5000&sort=name_ASC';
    const result = service.parseQueryString(queryString);
    expect(result).toEqual({
      difficulty: 'Hard',
      distance: 'GT_1000.LT_5000',
      sort: 'name_ASC',
      elevationGain: null,
      region: null,
      search: null,
    });
  });

  it('should handle an empty query string', () => {
    const queryString = '';
    const result = service.parseQueryString(queryString);
    expect(result).toEqual({
      difficulty: null,
      distance: null,
      sort: null,
      elevationGain: null,
      region: null,
      search: null,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse SQL operator for greater-than', () => {
    const operator = 'GT';
    const sqlOperator = service.parseSqlOperator(operator);
    expect(sqlOperator).toBe('>');
  });
  
  it('should handle an invalid SQL operator', () => {
    const operator = 'INVALID_OPERATOR';
    expect(() => service.parseSqlOperator(operator)).toThrowError(BadRequestException);
  });
  
  it('should parse SQL order by parameter', () => {
    const orderBy = 'ASC';
    const sqlOrderBy = service.parseSqlOrderBy(orderBy);
    expect(sqlOrderBy).toBe('ASC');
  });
  
  it('should handle an invalid SQL order by parameter', () => {
    const orderBy = 'invalid_order';
    expect(() => service.parseSqlOrderBy(orderBy)).toThrowError(BadRequestException);
  });

});
