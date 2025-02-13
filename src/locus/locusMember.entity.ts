import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Locus } from './locus.entity';

@Entity({ name: 'rnc_locus_members' })
export class LocusMember {
  @PrimaryGeneratedColumn()
  locusMemberId: number;

  @Column()
  regionId: number;

  @Column()
  locusId: number;

  @Column()
  membershipStatus: string;

  @ManyToOne(() => Locus, (locus) => locus.locusMembers)
  locus!: Locus;
}
