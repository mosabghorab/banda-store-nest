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
import { UploadImageDto } from '../../../core/dtos/upload-image.dto';
import { saveFile, validateDto } from '../../../core/helpers';

@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private readonly repo: Repository<Ad>) {}

  // create.
  async create(createAdDto: CreateAdDto, files: any): Promise<Ad> {
    const createAdUploadFilesDto =
      await this._prepareCreateAdUploadedFilesDtoFromFiles(files);
    return this.repo.save(
      await this.repo.create({
        image: createAdUploadFilesDto.image.name,
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
  async update(id: number, updateAdDto: UpdateAdDto, files: any): Promise<Ad> {
    const updateAdUploadFilesDto =
      await this._prepareUpdateAdUploadFilesDtoFromFiles(files);
    const ad = await this.findOneById(id);
    if (!ad) {
      throw new NotFoundException('Ad not found.');
    }
    if (updateAdUploadFilesDto.image) {
      unlinkSync(Constants.adsImagesPath + ad.image);
      ad.image = updateAdUploadFilesDto.image.name;
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

  // prepare create ad uploaded files dto from files.
  private _prepareCreateAdUploadedFilesDtoFromFiles = async (
    files: any,
  ): Promise<CreateAdUploadedFilesDto> => {
    const createAdUploadFilesDto = new CreateAdUploadedFilesDto();
    createAdUploadFilesDto.image = UploadImageDto.fromFile(files?.image);
    await validateDto(createAdUploadFilesDto);
    await saveFile(
      Constants.adsImagesPath,
      createAdUploadFilesDto.image.name,
      createAdUploadFilesDto.image,
    );
    return createAdUploadFilesDto;
  };

  // prepare update ad upload files dto from files.
  private _prepareUpdateAdUploadFilesDtoFromFiles = async (
    files: any,
  ): Promise<UpdateAdUploadedFilesDto> => {
    const updateAdUploadFilesDto = new UpdateAdUploadedFilesDto();
    updateAdUploadFilesDto.image = UploadImageDto.fromFile(files?.image);
    await validateDto(updateAdUploadFilesDto);
    if (updateAdUploadFilesDto.image)
      await saveFile(
        Constants.adsImagesPath,
        updateAdUploadFilesDto.image.name,
        updateAdUploadFilesDto.image,
      );
    return updateAdUploadFilesDto;
  };
}
