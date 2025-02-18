import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocusMember } from './locusMember.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'rnc_locus' })
export class Locus {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'assembly_id' })
  assemblyId: string;

  @ApiProperty()
  @Column({ name: 'locus_name' })
  locusName: string;

  @ApiProperty()
  @Column({ name: 'public_locus_name' })
  publicLocusName: string;

  @ApiProperty()
  @Column()
  chromosome: string;

  @ApiProperty()
  @Column()
  strand: string;

  @ApiProperty()
  @Column({ name: 'locus_start' })
  locusStart: number;

  @ApiProperty()
  @Column({ name: 'locus_stop' })
  locusStop: number;

  @ApiProperty()
  @Column({ name: 'member_count' })
  memberCount: number;

  @OneToMany(() => LocusMember, (locusMember) => locusMember.locus)
  locusMembers: LocusMember[];
}
