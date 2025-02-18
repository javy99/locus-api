import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';

export enum SideLoadingOption {
  LOCUS_MEMBERS = 'locusMembers',
}

export enum RegionId {
  ID1 = 86118093,
  ID2 = 86696489,
  ID3 = 88186467,
}

export class GetLocusDto {
  @ApiProperty({ required: false, description: 'Filter by ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @ApiProperty({ required: false, description: 'Filter by assembly ID' })
  @IsOptional()
  @IsString()
  assemblyId?: number;

  @ApiProperty({ required: false, description: 'Filter by region ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  regionId?: number;

  @ApiProperty({ required: false, description: 'Filter by membership status' })
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiProperty({
    required: false,
    enum: SideLoadingOption,
    description: 'Sideloading options',
  })
  @IsOptional()
  @IsEnum(SideLoadingOption)
  sideloading?: SideLoadingOption;

  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rows?: number = 1000;

  @ApiProperty({ required: false, description: 'Sorting field' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ required: false, description: 'Sorting order (ASC or DESC)' })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'ASC';
}
