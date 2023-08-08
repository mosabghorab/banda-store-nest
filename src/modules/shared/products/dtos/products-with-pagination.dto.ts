import { Expose, Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class ProductsWithPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => ProductDto)
  data: ProductDto[];
}
