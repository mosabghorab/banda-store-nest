import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { UpdateAdDto } from './dtos/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Ad } from './entities/ad.entity';
import { CreateAdUploadedFilesDto } from './dtos/create-ad-uploaded-files.dto';
import { UpdateAdUploadedFilesDto } from './dtos/update-ad-uploaded-files.dto';
import { createReadStream, unlinkSync } from 'fs';
import { Constants } from '../../../core/constants';
import { saveFile } from '../../../core/helpers';

@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private readonly repo: Repository<Ad>) {}

  // create.
  async create(
    createAdDto: CreateAdDto,
    createAdUploadedFilesDto: CreateAdUploadedFilesDto,
  ): Promise<Ad> {
    await saveFile(
      Constants.adsImagesPath,
      createAdUploadedFilesDto.image.name,
      createAdUploadedFilesDto.image,
    );
    return this.repo.save(
      await this.repo.create({
        image: createAdUploadedFilesDto.image.name,
        ...createAdDto,
      }),
    );
  }

  // find all.
  findAll(relations?: FindOptionsRelations<Ad>): Promise<Ad[]> {
    return this.repo.find({ relations: relations });
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Ad>): Promise<Ad> {
    return this.repo.findOne({ where: { id }, relations: relations });
  }

  // find image by id.
  async findImageById(
    id: number,
  ): Promise<{ fileExt: string; streamableFile: StreamableFile }> {
    const ad = await this.findOneById(id);
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    const file = createReadStream(Constants.adsImagesPath + ad.image);
    const fileExt = ad.image.split('.')[1];
    return { fileExt, streamableFile: new StreamableFile(file) };
  }

  // update.
  async update(
    id: number,
    updateAdDto: UpdateAdDto,
    updateAdUploadedFilesDto: UpdateAdUploadedFilesDto,
  ): Promise<Ad> {
    const ad = await this.findOneById(id);
    if (!ad) {
      throw new NotFoundException('Ad not found.');
    }
    if (updateAdUploadedFilesDto.image) {
      await saveFile(
        Constants.adsImagesPath,
        updateAdUploadedFilesDto.image.name,
        updateAdUploadedFilesDto.image,
      );
      unlinkSync(Constants.adsImagesPath + ad.image);
      ad.image = updateAdUploadedFilesDto.image.name;
    }
    Object.assign(ad, updateAdDto);
    return this.repo.save(ad);
  }

  // remove.
  async remove(id: number): Promise<Ad> {
    const ad = await this.findOneById(id);
    if (!ad) {
      throw new BadRequestException('Please provide a valid ad id');
    }
    return this.repo.remove(ad);
  }
}
