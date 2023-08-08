import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ProductsModule } from '../products/products.module';
import { ReasonsModule } from '../reasons/reasons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), ProductsModule, ReasonsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
