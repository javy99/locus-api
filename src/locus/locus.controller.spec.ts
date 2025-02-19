import { Test, TestingModule } from '@nestjs/testing';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { GetLocusDto, SideLoadingOption } from './dto/getLocus.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../auth/role.enum';
import { Locus } from './entities/locus.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

describe('LocusController', () => {
  let controller: LocusController;
  let validationPipe: ValidationPipe;

  const mockLocusService = {
    getLocus: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [
        {
          provide: LocusService,
          useValue: mockLocusService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: () => true },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue([Role.ADMIN]),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<LocusController>(LocusController);
    validationPipe = new ValidationPipe({ transform: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocus', () => {
    const mockLocusData: Locus[] = [
      {
        id: 1,
        assemblyId: 'test',
        locusName: 'test',
        publicLocusName: 'test',
        chromosome: 'test',
        strand: 'test',
        locusStart: 1,
        locusStop: 1,
        memberCount: 1,
        locusMembers: [],
      },
    ];

    it('should call locusService.getLocus with correct parameters and ADMIN role', async () => {
      const queryParams: GetLocusDto = { id: 123 };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.ADMIN },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.ADMIN,
      );
      expect(result).toEqual(mockLocusData);
    });

    it('should call locusService.getLocus with correct parameters and NORMAL role', async () => {
      const queryParams: GetLocusDto = { assemblyId: 'test' };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.NORMAL },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.NORMAL,
      );
      expect(result).toEqual(mockLocusData);
    });

    it('should call locusService.getLocus with correct parameters and LIMITED role', async () => {
      const queryParams: GetLocusDto = { regionId: 86118093 };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.LIMITED },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.LIMITED,
      );
      expect(result).toEqual(mockLocusData);
    });

    it('should throw ForbiddenException for NORMAL role with sideloading option', async () => {
      const queryParams: GetLocusDto = {
        sideloading: SideLoadingOption.LOCUS_MEMBERS,
      };

      mockLocusService.getLocus.mockRejectedValue(
        new ForbiddenException('Sideloading is not allowed for normal users.'),
      );

      await expect(
        controller.getLocus(queryParams, {
          user: { role: Role.NORMAL },
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.NORMAL,
      );
    });

    it('should throw ForbiddenException for LIMITED role with sideloading option', async () => {
      const queryParams: GetLocusDto = {
        sideloading: SideLoadingOption.LOCUS_MEMBERS,
      };
      mockLocusService.getLocus.mockRejectedValue(
        new ForbiddenException('Sideloading is not allowed for limited users.'),
      );

      await expect(
        controller.getLocus(queryParams, {
          user: { role: Role.LIMITED },
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.LIMITED,
      );
    });

    it('should call locusService.getLocus with correct parameters and sideloading option for ADMIN role', async () => {
      const queryParams: GetLocusDto = {
        sideloading: SideLoadingOption.LOCUS_MEMBERS,
      };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.ADMIN },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.ADMIN,
      );
      expect(result).toEqual(mockLocusData);
    });

    it('should call locusService.getLocus with correct parameters and pagination options', async () => {
      const queryParams: GetLocusDto = { page: 2, rows: 50 };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.ADMIN },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.ADMIN,
      );
      expect(result).toEqual(mockLocusData);
    });

    it('should call locusService.getLocus with correct parameters and sorting options', async () => {
      const queryParams: GetLocusDto = { sort: 'locusName', order: 'ASC' };
      mockLocusService.getLocus.mockResolvedValue(mockLocusData);

      const result = await controller.getLocus(queryParams, {
        user: { role: Role.ADMIN },
      });

      expect(mockLocusService.getLocus).toHaveBeenCalledWith(
        queryParams,
        Role.ADMIN,
      );
      expect(result).toEqual(mockLocusData);
    });
  });

  describe('Validation', () => {
    it('should throw BadRequestException for invalid id', async () => {
      const queryParams = { id: 'invalid' };
      try {
        await validationPipe.transform(queryParams, {
          type: 'query',
          metatype: GetLocusDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw BadRequestException for invalid page', async () => {
      const queryParams = { page: 'invalid' };
      try {
        await validationPipe.transform(queryParams, {
          type: 'query',
          metatype: GetLocusDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw BadRequestException for invalid rows', async () => {
      const queryParams = { rows: 'invalid' };
      try {
        await validationPipe.transform(queryParams, {
          type: 'query',
          metatype: GetLocusDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw BadRequestException for invalid sort order', async () => {
      const queryParams = { sort: 'locusName', order: 'invalid' };
      try {
        await validationPipe.transform(queryParams, {
          type: 'query',
          metatype: GetLocusDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  jest.clearAllMocks();
});
