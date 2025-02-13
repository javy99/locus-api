import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocusModule } from './locus/locus.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'hh-pgsql-public.ebi.ac.uk',
      port: 5432,
      username: 'reader',
      password: 'NWDMCE5xdipIjRrp',
      database: 'pfmegrnargs',
      autoLoadEntities: true,
      synchronize: false,
    }),
    LocusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
