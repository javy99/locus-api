import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locus } from './entities/locus.entity';
import { GetLocusDto, RegionId, SideLoadingOption } from './dto/getLocus.dto';
import { LocusMember } from './entities/locusMember.entity';
import { Role } from '../auth/role.enum';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private locusRepository: Repository<Locus>,
    @InjectRepository(LocusMember)
    private locusMemberRepository: Repository<LocusMember>,
  ) {}

  async getLocus(dto: GetLocusDto, role: Role): Promise<Locus[]> {
    const {
      id,
      assemblyId,
      regionId,
      membershipStatus,
      sideloading,
      page = 1,
      rows = 1000,
      sort,
      order = 'ASC',
    } = dto;

    if (sideloading === SideLoadingOption.LOCUS_MEMBERS) {
      if (role === Role.NORMAL) {
        throw new ForbiddenException(
          'Sideloading is not allowed for normal users.',
        );
      } else if (role === Role.LIMITED) {
        throw new ForbiddenException(
          'Sideloading is not allowed for limited users.',
        );
      }
    }

    const skip = (page - 1) * rows;

    const queryBuilder = this.locusRepository.createQueryBuilder('rl');

    if (id) {
      queryBuilder.andWhere('rl.id = :id', { id });
    }

    if (assemblyId) {
      queryBuilder.andWhere('rl.assemblyId = :assemblyId', { assemblyId });
    }

    if (role === Role.LIMITED) {
      const subQuery = this.locusMemberRepository
        .createQueryBuilder('rlm')
        .select('rlm.locusId')
        .where('rlm.regionId IN (:...regionIds)', {
          regionIds: [RegionId.ID1, RegionId.ID2, RegionId.ID3],
        });

      queryBuilder.andWhere(`rl.id IN (${subQuery.getQuery()})`);
      queryBuilder.setParameters(subQuery.getParameters());
    } else {
      if (regionId || membershipStatus) {
        // Subquery to find locus IDs based on regionId and membershipStatus
        const subQuery = this.locusMemberRepository
          .createQueryBuilder('rlm')
          .select('rlm.locusId')
          .where('1=1'); // Dummy where clause

        if (regionId) {
          subQuery.andWhere('rlm.regionId = :regionId', { regionId });
        }

        if (membershipStatus) {
          subQuery.andWhere('rlm.membershipStatus = :membershipStatus', {
            membershipStatus,
          });
        }

        queryBuilder.andWhere(`rl.id IN (${subQuery.getQuery()})`);
        queryBuilder.setParameters(subQuery.getParameters());
      }
    }

    if (sort) {
      queryBuilder.orderBy(`rl.${sort}`, order);
    }
    queryBuilder.skip(skip);
    queryBuilder.take(rows);

    if (
      role !== Role.NORMAL &&
      sideloading === SideLoadingOption.LOCUS_MEMBERS
    ) {
      queryBuilder.leftJoinAndSelect('rl.locusMembers', 'locusMembers');
    }

    if (role === Role.NORMAL) {
      queryBuilder.select([
        'rl.id',
        'rl.assemblyId',
        'rl.locusName',
        'rl.publicLocusName',
        'rl.chromosome',
        'rl.strand',
        'rl.locusStart',
        'rl.locusStop',
        'rl.memberCount',
      ]);
    }

    const locus = await queryBuilder.getMany();
    return locus;
  }
}
