import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Locus } from './locus.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'rnc_locus_members' })
export class LocusMember {
  @ApiProperty()
  @PrimaryColumn({ name: 'id' })
  locusMemberId: number;

  @ApiProperty()
  @Column({ name: 'region_id' })
  regionId: number;

  @PrimaryColumn({ name: 'locus_id' })
  locusId: number;

  @ApiProperty()
  @Column({ name: 'membership_status' })
  membershipStatus: string;

  @ManyToOne(() => Locus, (locus) => locus.locusMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locus_id' })
  locus!: Locus;
}
