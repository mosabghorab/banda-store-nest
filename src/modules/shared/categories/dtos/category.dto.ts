import { Expose, Transform, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';
import { Constants } from '../../../../core/constants';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  parentId: number;

  @Expose()
  name: string;

  @Expose()
  @Transform(
    ({ value }) => Constants.baseUrl + Constants.categoriesImagesUrl + value,
  )
  image: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => CategoryDto)
  parent: CategoryDto;

  @Expose()
  @Type(() => CategoryDto)
  subCategories: CategoryDto[];
}
