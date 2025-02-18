import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocusMember } from './locusMember.entity';

@Entity({ name: 'rnc_locus' })
export class Locus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assemblyId: string;

  @Column()
  locusName: string;

  @Column()
  publicLocusName: string;

  @Column()
  chromosome: string;

  @Column()
  strand: string;

  @Column()
  locusStart: number;

  @Column()
  locusStop: number;

  @Column()
  memberCount: number;

  @OneToMany(() => LocusMember, (locusMember) => locusMember.locus)
  locusMembers: LocusMember[];
}
