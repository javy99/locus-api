import { Module } from '@nestjs/common';
import { LocusService } from './locus.service';
import { LocusController } from './locus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locus } from './entities/locus.entity';
import { LocusMember } from './entities/locusMember.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Locus, LocusMember]),
    AuthModule,
    JwtModule.register({}),
  ],
  providers: [LocusService],
  controllers: [LocusController],
})
export class LocusModule {}
