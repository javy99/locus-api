import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locus } from './entities/locus.entity';
import { GetLocusDto, RegionId, SideLoadingOption } from './dto/getLocus.dto';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private locusRepository: Repository<Locus>,
  ) {}

  async getLocus(dto: GetLocusDto, role: string): Promise<Locus[]> {
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

    const skip = (page - 1) * rows;

    const queryBuilder = this.locusRepository.createQueryBuilder('rl');

    if (id) {
      queryBuilder.andWhere('rl.id = :id', { id });
    }

    if (assemblyId) {
      queryBuilder.andWhere('rl.assemblyId = :assemblyId', { assemblyId });
    }

    console.log(role);

    if (role === 'limited') {
      queryBuilder.leftJoinAndSelect('rl.locusMembers', 'rlm');
      queryBuilder.andWhere('rlm.regionId IN (:...regionIds)', {
        regionIds: [RegionId.ID1, RegionId.ID2, RegionId.ID3],
      });
    } else {
      if (regionId || membershipStatus) {
        queryBuilder.leftJoinAndSelect('rl.locusMembers', 'rlm');
        if (regionId) {
          queryBuilder.andWhere('rlm.regionId = :regionId', { regionId });
        }

        if (membershipStatus) {
          queryBuilder.andWhere('rlm.membershipStatus = :membershipStatus', {
            membershipStatus,
          });
        }
      }
    }

    if (sort) {
      queryBuilder.orderBy(`rl.${sort}`, order);
    }
    queryBuilder.skip(skip);
    queryBuilder.take(rows);

    if (role !== 'normal' && sideloading === SideLoadingOption.LOCUS_MEMBERS) {
      queryBuilder.leftJoinAndSelect('rl.locusMembers', 'locusMembers');
    }

    if (role === 'normal') {
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
