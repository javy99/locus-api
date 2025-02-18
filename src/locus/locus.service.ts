import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocusMember } from './entities/locusMember.entity';
import { Repository } from 'typeorm';
import { Locus } from './entities/locus.entity';

interface LocusFilters {
  id?: number;
  assemblyId?: number;
  regionId?: number;
}

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private locusRepository: Repository<Locus>,
    @InjectRepository(LocusMember)
    private locusMemberRepository: Repository<LocusMember>,
  ) {}

  async getLocus(
    filters: LocusFilters,
    sideloading: boolean,
    page: number,
    limit: number,
  ) {
    const query = this.locusRepository.createQueryBuilder('locus');

    // Apply filters
    if (filters.id) query.andWhere('locus.id = :id', { id: filters.id });
    if (filters.assemblyId)
      query.andWhere('locus.assemblyId = :assemblyId', {
        assemblyId: filters.assemblyId,
      });
    if (filters.regionId)
      query.andWhere('locusMembers.regionId = :regionId', {
        regionId: filters.regionId,
      });

    if (sideloading) {
      query.leftJoinAndSelect('locus.locusMembers', 'locusMembers');
    }

    query.take(limit).skip((page - 1) * limit);

    return query.getMany();
  }
}
