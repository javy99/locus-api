import { Test, TestingModule } from '@nestjs/testing';
import { LocusService } from './locus.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Locus } from './entities/locus.entity';
import { LocusMember } from './entities/locusMember.entity';
import { ConfigModule } from '@nestjs/config';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetLocusDto } from './dto/getLocus.dto';
import { Role } from '../auth/role.enum';

describe('LocusService', () => {
  let service: LocusService;
  let locusRepository: Repository<Locus>;

  const mockLocusData: Locus[] = [
    {
      id: 1,
      assemblyId: 'assembly1',
      locusName: 'locus1',
      publicLocusName: 'public1',
      chromosome: 'chr1',
      strand: '1',
      locusStart: 100,
      locusStop: 200,
      memberCount: 1,
      locusMembers: [],
    },
    {
      id: 2,
      assemblyId: 'assembly2',
      locusName: 'locus2',
      publicLocusName: 'public2',
      chromosome: 'chr2',
      strand: '-1',
      locusStart: 300,
      locusStop: 400,
      memberCount: 2,
      locusMembers: [],
    },
  ];

  const mockSelectQueryBuilder: Partial<SelectQueryBuilder<Locus>> = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockLocusData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          entities: ['src/**/*.entity{.ts,.js}'],
        }),
        TypeOrmModule.forFeature([Locus, LocusMember]),
      ],
      providers: [LocusService],
    }).compile();

    service = module.get<LocusService>(LocusService);
    locusRepository = module.get<Repository<Locus>>(getRepositoryToken(Locus));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLocus', () => {
    it('should filter by assemblyId', async () => {
      const queryParams: GetLocusDto = { assemblyId: 'assembly1' };

      jest
        .spyOn(locusRepository, 'createQueryBuilder')
        .mockReturnValue(mockSelectQueryBuilder as SelectQueryBuilder<Locus>);

      const result = await service.getLocus(queryParams, Role.ADMIN);

      expect(locusRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith(
        'rl.assemblyId = :assemblyId',
        { assemblyId: 'assembly1' },
      );
      expect(result).toEqual(mockLocusData);
    });
  });
});
