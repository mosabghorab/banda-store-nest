import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reason } from './entities/reason.entity';
import { CreateReasonDto } from './dtos/create-reason.dto';
import { UpdateReasonDto } from './dtos/update-reason.dto';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason) private readonly repo: Repository<Reason>,
  ) {}

  async create(createReasonDto: CreateReasonDto) {
    const reason = await this.repo.create(createReasonDto);
    return this.repo.save(reason);
  }

  async update(id: number, updateReasonDto: UpdateReasonDto) {
    const reason = await this.findOneById(id);
    if (!reason) {
      throw new NotFoundException('Reason not found');
    }
    Object.assign(reason, updateReasonDto);
    return this.repo.save(reason);
  }

  async findOneById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async findAll() {
    return this.repo.find();
  }

  async delete(id: number) {
    const reason = await this.findOneById(id);
    if (!reason) {
      throw new NotFoundException('Reason not found.');
    }
    return this.repo.remove(reason);
  }
}
