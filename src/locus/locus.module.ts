import { Module } from '@nestjs/common';
import { LocusService } from './locus.service';
import { LocusController } from './locus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locus } from './locus.entity';
import { LocusMember } from './locusMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locus, LocusMember])],
  providers: [LocusService],
  controllers: [LocusController],
})
export class LocusModule {}
