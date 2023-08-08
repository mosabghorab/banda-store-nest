import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductsService } from '../products/products.service';
import { unlinkSync } from 'fs';
import { Constants } from '../../../core/constants';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repo: Repository<ProductImage>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // create.
  async create(productId: number, name: string) {
    const productImage = await this.repo.create({ productId, name });
    return this.repo.save(productImage);
  }

  // update.
  async update(id: number, name: string) {
    const productImage = await this.repo.findOne({ where: { id } });
    if (!productImage) {
      throw new NotFoundException('Product image not found');
    }
    productImage.name = name;
    return this.repo.save(productImage);
  }

  // delete.
  async delete(...ids) {
    const productImages = await this.repo
      .createQueryBuilder('product-image')
      .where('product-image.id IN (:...ids)', { ids })
      .getMany();
    for (const value of productImages) {
      await this.repo.remove(value);
      await unlinkSync(Constants.productsImagesPath + value.name);
    }
    return true;
  }

  // delete by product id.
  async deleteByProductId(productId: number) {
    const productImages = await this.repo.find({ where: { productId } });
    for (const value of productImages) {
      unlinkSync(Constants.productsImagesPath + value.name);
      await this.repo.remove(value);
    }
    return true;
  }
}
