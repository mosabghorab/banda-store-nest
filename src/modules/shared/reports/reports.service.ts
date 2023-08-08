import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ProductsService } from '../products/products.service';
import { ReasonsService } from '../reasons/reasons.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
    private readonly productsService: ProductsService,
    private readonly reasonsService: ReasonsService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const report = await this.repo.create(createReportDto);
    const product = await this.productsService.findOneById(
      createReportDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    const reason = await this.reasonsService.findOneById(
      createReportDto.reasonId,
    );
    if (!reason) {
      throw new NotFoundException('Reason not found.');
    }
    report.product = product;
    report.reason = reason;
    return this.repo.save(report);
  }

  findAll() {
    return this.repo.find({
      relations: {
        product: { subCategory: { parent: true }, user: true },
        reason: true,
      },
    });
  }

  async findOneById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        product: { subCategory: { parent: true }, user: true },
        reason: true,
      },
    });
  }

  async remove(id: number) {
    const report = await this.findOneById(id);
    if (!report) {
      throw new NotFoundException('Report not found.');
    }
    return this.repo.remove(report);
  }
}
