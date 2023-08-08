import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Ad])],
  controllers: [AdsController],
  providers: [AdsService]
})
export class AdsModule {}
