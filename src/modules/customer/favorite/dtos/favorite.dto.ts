import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../../shared/users/dtos/user.dto';
import { ProductDto } from '../../../shared/products/dtos/product.dto';

export class FavoriteDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  productId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;
}
