import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UsersService } from '../users/users.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FilterProductsDto } from './dtos/filter-products.dto';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductUploadFilesDto } from './dtos/create-product-upload-files.dto';
import { ProductImagesService } from '../product-images/product-images.service';
import { unlinkSync } from 'fs';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { UpdateProductUploadFilesDto } from './dtos/update-product-upload-files.dto';
import { Constants } from '../../../core/constants';
import { faker } from '@faker-js/faker';
import { UploadImageDto } from '../../../core/dtos/upload-image.dto';
import { saveFile, validateDto } from '../../../core/helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    @Inject(forwardRef(() => ProductImagesService))
    private readonly productImagesService: ProductImagesService,
  ) {}

  // create new product.
  async create(userId: number, createProductDto: CreateProductDto, files: any) {
    const createProductUploadFilesDto =
      await this._prepareCreateProductUploadFilesDtoFromFiles(files);
    const user = await this.usersService.findOneById(userId);
    const category = await this.categoriesService.findOneById(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const subCategory = await this.categoriesService.findOneById(
      createProductDto.subCategoryId,
    );
    if (!subCategory) {
      throw new NotFoundException('Sub category not found');
    }
    const product = await this.repo.create({
      mainImage: createProductUploadFilesDto.mainImage.name,
      ...createProductDto,
    });
    product.user = user;
    product.category = category;
    product.subCategory = subCategory;
    const newProduct = await this.repo.save(product);
    // save product images.
    const images = [];
    for (const value of createProductUploadFilesDto.images) {
      images.push(
        await this.productImagesService.create(newProduct.id, value.name),
      );
    }
    newProduct.images = images;
    return newProduct;
  }

  // find products with filter.
  async findAll(filterProductsDto: FilterProductsDto) {
    const query = this.repo.createQueryBuilder('product');
    query.leftJoinAndSelect('product.user', 'user');
    query.leftJoinAndSelect('product.category', 'category');
    query.leftJoinAndSelect('product.subCategory', 'subCategory');
    query.leftJoinAndSelect('product.images', 'images');
    const offset = (filterProductsDto.page - 1) * filterProductsDto.limit;
    query.skip(offset).take(filterProductsDto.limit);
    if (filterProductsDto.userId) {
      query.andWhere('product.userId = :userId', {
        userId: filterProductsDto.userId,
      });
    }
    if (filterProductsDto.name) {
      query.andWhere(
        `JSON_EXTRACT(product.name, '$.ar') LIKE :name OR JSON_EXTRACT(product.name, '$.en') LIKE :name`,
        {
          name: `%${filterProductsDto.name}%`,
        },
      );
    }
    if (filterProductsDto.priceFrom) {
      query.andWhere('product.price >= :priceFrom', {
        priceFrom: filterProductsDto.priceFrom,
      });
    }
    if (filterProductsDto.priceTo) {
      query.andWhere('product.price <= :priceTo', {
        priceTo: filterProductsDto.priceTo,
      });
    }
    if (filterProductsDto.discount) {
      query.andWhere('product.discount >= :discount', {
        discount: filterProductsDto.discount,
      });
    }
    if (filterProductsDto.isBestOffers != null) {
      query.andWhere('product.isBestOffers = :isBestOffers', {
        isBestOffers: filterProductsDto.isBestOffers,
      });
    }
    const [data, count] = await query.getManyAndCount();
    return {
      perPage: filterProductsDto.limit,
      currentPage: filterProductsDto.page,
      lastPage: Math.ceil(count / filterProductsDto.limit),
      total: count,
      data: data,
    };
  }

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Product>) {
    return await this.repo.findOne({
      where: { id },
      relations: relations,
    });
  }

  // update.
  async update(id: number, updateProductDto: UpdateProductDto, files: any) {
    const updateProductUploadFilesDto =
      await this._prepareUpdateProductUploadFilesDtoFromFiles(files);
    const product = await this.findOneById(id, { images: true });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    if (updateProductUploadFilesDto.mainImage) {
      unlinkSync(Constants.productsImagesPath + product.mainImage);
      product.mainImage = updateProductUploadFilesDto.mainImage.name;
    }
    if (updateProductUploadFilesDto.images?.length > 0) {
      const images = [];
      for (const value of updateProductUploadFilesDto.images) {
        images.push(
          await this.productImagesService.create(product.id, value.name),
        );
      }
      product.images.push(...images);
    }
    if (updateProductDto.deleteImages?.length > 0) {
      await this.productImagesService.delete(updateProductDto.deleteImages);
      product.images = product.images.filter(
        (e) => !updateProductDto.deleteImages.includes(e.id),
      );
    }
    delete updateProductDto.deleteImages;
    Object.assign(product, updateProductDto);
    return await this.repo.save(product);
  }

  // delete.
  async delete(id: number) {
    const product = await this.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    const result = await this.productImagesService.deleteByProductId(id);
    if (!result) {
      throw new InternalServerErrorException();
    }
    unlinkSync(Constants.productsImagesPath + product.mainImage);
    return this.repo.remove(product);
  }

  // faker for products.
  async generateFake(userId: number, count: number): Promise<Product[]> {
    const categoryId = (await this.categoriesService.findOneRandom()).id;
    const subCategoryId = (await this.categoriesService.findOneRandom(true)).id;
    const fakeData = Array.from({ length: count }).map(() => ({
      name: JSON.stringify({
        en: faker.commerce.product(),
        ar: faker.commerce.product(),
      }),
      userId: userId,
      description: JSON.stringify({
        en: faker.lorem.paragraph(10),
        ar: faker.lorem.paragraph(10),
      }),
      price: faker.number.float({ min: 10, max: 10000 }),
      viewCount: faker.number.int({ min: 0, max: 10000 }),
      mainImage: faker.image.avatar(),
      discount: faker.number.float({ min: 0, max: 50 }),
      isBestOffers: faker.datatype.boolean(),
      categoryId: categoryId,
      subCategoryId: subCategoryId,
    }));
    return await this.repo.save(fakeData);
  }

  // prepare create product upload files dto from files.
  private _prepareCreateProductUploadFilesDtoFromFiles = async (
    files: any,
  ): Promise<CreateProductUploadFilesDto> => {
    const imagesUploadImageDto = [];
    for (const image of files?.images || []) {
      imagesUploadImageDto.push(UploadImageDto.fromFile(image));
    }
    const createProductUploadFilesDto = new CreateProductUploadFilesDto();
    createProductUploadFilesDto.mainImage = UploadImageDto.fromFile(
      files?.mainImage,
    );
    createProductUploadFilesDto.images = imagesUploadImageDto;
    await validateDto(createProductUploadFilesDto);
    await saveFile(
      Constants.productsImagesPath,
      createProductUploadFilesDto.mainImage?.name,
      createProductUploadFilesDto.mainImage,
    );
    for (const image of createProductUploadFilesDto.images) {
      await saveFile(Constants.productsImagesPath, image.name, image);
    }
    return createProductUploadFilesDto;
  };

  // prepare update product upload files dto from files.
  private _prepareUpdateProductUploadFilesDtoFromFiles = async (
    files: any,
  ): Promise<UpdateProductUploadFilesDto> => {
    const imagesUploadImageDto = [];
    for (const image of files?.images || []) {
      imagesUploadImageDto.push(UploadImageDto.fromFile(image));
    }
    const updateProductUploadFilesDto = new UpdateProductUploadFilesDto();
    updateProductUploadFilesDto.mainImage = UploadImageDto.fromFile(
      files?.mainImage,
    );
    updateProductUploadFilesDto.images = imagesUploadImageDto;
    await validateDto(updateProductUploadFilesDto);
    if (updateProductUploadFilesDto.mainImage)
      await saveFile(
        Constants.productsImagesPath,
        updateProductUploadFilesDto.mainImage?.name,
        updateProductUploadFilesDto.mainImage,
      );
    for (const image of updateProductUploadFilesDto.images) {
      await saveFile(Constants.productsImagesPath, image.name, image);
    }
    return updateProductUploadFilesDto;
  };
}
