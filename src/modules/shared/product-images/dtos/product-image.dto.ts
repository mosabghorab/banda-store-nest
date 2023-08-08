import { Expose, Transform, Type } from 'class-transformer';
import { ProductDto } from '../../products/dtos/product.dto';
import { Constants } from '../../../../core/constants';

export class ProductImageDto {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  @Transform(({ value }) =>
    !value ? null : Constants.baseUrl + Constants.productsImagesUrl + value,
  )
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;
}
