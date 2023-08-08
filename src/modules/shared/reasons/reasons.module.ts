import { Module } from '@nestjs/common';
import { ReasonsService } from './reasons.service';
import { ReasonsController } from './reasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reason } from './entities/reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reason])],
  providers: [ReasonsService],
  controllers: [ReasonsController],
  exports: [ReasonsService],
})
export class ReasonsModule {}
