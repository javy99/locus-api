import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocusService } from './locus.service';

@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLocus(
    @Query('id') id?: string,
    @Query('assemblyId') assemblyId?: string,
    @Query('regionId') regionId?: number,
    @Query('sideloading') sideloading?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '1000',
  ) {
    const filters = {
      id: id ? Number(id) : undefined,
      assemblyId: assemblyId ? Number(assemblyId) : undefined,
      regionId: regionId ? Number(regionId) : undefined,
    };

    return this.locusService.getLocus(
      filters,
      sideloading === 'true',
      Number(page),
      Number(limit),
    );
  }
}
