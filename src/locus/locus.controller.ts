import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocusService } from './locus.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetLocusDto, SideLoadingOption } from './dto/getLocus.dto';
import { Locus } from './entities/locus.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('locus')
@ApiBearerAuth()
@Controller('locus')
@UseGuards(RolesGuard)
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @Roles(Role.ADMIN, Role.NORMAL, Role.LIMITED)
  @ApiQuery({
    name: 'id',
    required: false,
    type: Number,
    description: 'Filter by ID',
  })
  @ApiQuery({
    name: 'assemblyId',
    required: false,
    type: String,
    description: 'Filter by assembly ID',
  })
  @ApiQuery({
    name: 'regionId',
    required: false,
    type: Number,
    description: 'Filter by region ID',
  })
  @ApiQuery({
    name: 'membershipStatus',
    required: false,
    type: String,
    description: 'Filter by membership status',
  })
  @ApiQuery({
    name: 'sideloading',
    required: false,
    enum: [SideLoadingOption.LOCUS_MEMBERS],
    description: 'Sideloading options (locusMembers)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'rows',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sorting field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sorting order (ASC or DESC)',
  })
  async getLocus(
    @Query(new ValidationPipe({ transform: true })) query: GetLocusDto,
    @Request() req: { user: { role: Role } },
  ): Promise<Locus[]> {
    const user: { role: Role } = req.user;
    return this.locusService.getLocus(query, user.role);
  }
}
