import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    return this.repo.save(await this.repo.create(createSettingDto));
  }

  findAll() {
    return this.repo.find();
  }

  async findOneByKey(key: string) {
    const setting = await this.repo.findOne({ where: { key } });
    if (!setting) {
      throw new BadRequestException('No setting with the provided key.');
    }
    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.findOneByKey(key);
    Object.assign(setting, updateSettingDto);
    return this.repo.save(setting);
  }
}
