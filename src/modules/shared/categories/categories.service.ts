import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { unlinkSync } from 'fs';
import { UpdateCategoryUploadedFilesDto } from './dtos/update-category-upload-files.dto';
import { Constants } from '../../../core/constants';
import { saveFile } from '../../../core/helpers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  // create.
  async create(
    userId: number,
    createCategoryDto: CreateCategoryDto,
    createCategoryUploadedFilesDto,
  ) {
    let parent;
    if (createCategoryDto.parentId) {
      parent = await this.findOneById(createCategoryDto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
    }
    await saveFile(
      Constants.categoriesImagesPath,
      createCategoryUploadedFilesDto.image?.name,
      createCategoryUploadedFilesDto.image,
    );
    const category = await this.repo.create({
      image: createCategoryUploadedFilesDto.image.name,
      userId: userId,
      ...createCategoryDto,
    });
    category.parent = parent;
    return this.repo.save(category);
  }

  // update.
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    updateCategoryUploadedFilesDto: UpdateCategoryUploadedFilesDto,
  ) {
    const category = await this.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    if (updateCategoryDto.parentId) {
      const parent = await this.findOneById(updateCategoryDto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
      category.parent = parent;
    }
    if (updateCategoryUploadedFilesDto.image) {
      await saveFile(
        Constants.categoriesImagesPath,
        updateCategoryUploadedFilesDto.image?.name,
        updateCategoryUploadedFilesDto.image,
      );
      unlinkSync(Constants.categoriesImagesPath + category.image);
      category.image = updateCategoryUploadedFilesDto.image.name;
    }
    Object.assign(category, updateCategoryDto);
    return this.repo.save(category);
  }

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Category>) {
    return this.repo.findOne({
      where: { id },
      relations: relations,
    });
  }

  // find one random.
  async findOneRandom(isSubCategory = false): Promise<Category> {
    const count = await this.repo.count({
      where: {
        parentId: isSubCategory ? Not(IsNull()) : IsNull(),
      },
    });
    const randomIndex = Math.floor(Math.random() * count);
    return (
      await this.repo.find({
        where: {
          parentId: isSubCategory ? Not(IsNull()) : IsNull(),
        },
        skip: randomIndex,
        take: 1,
      })
    )[0];
  }

  // find all.
  async findAll(relations?: FindOptionsRelations<Category>) {
    return this.repo.find({
      where: { parentId: IsNull() },
      relations: relations,
    });
  }

  // delete.
  async delete(id: number) {
    const category = await this.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    unlinkSync(Constants.categoriesImagesPath + category.image);
    return this.repo.remove(category);
  }
}
