import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locus } from './entities/locus.entity';
import { GetLocusDto, SideLoadingOption } from './dto/getLocus.dto';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private locusRepository: Repository<Locus>,
  ) {}

  async getLocus(dto: GetLocusDto): Promise<Locus[]> {
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

    // Region ID and membership status needs to be joined with rnc_locus_members
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

    if (sort) {
      queryBuilder.orderBy(`rl.${sort}`, order);
    }
    queryBuilder.skip(skip);
    queryBuilder.take(rows);
    if (sideloading === SideLoadingOption.LOCUS_MEMBERS) {
      queryBuilder.leftJoinAndSelect('rl.locusMembers', 'locusMembers');
    }

    const locus = await queryBuilder.getMany();
    return locus;
  }
}
