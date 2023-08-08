import { Expose, Transform, Type } from 'class-transformer';
import { Constants } from '../../../../core/constants';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';
import { AdminsRolesDto } from '../../../admin/admins-roles/dtos/admins-roles.dto';
import { FavoriteDto } from '../../../customer/favorite/dtos/favorite.dto';
import { ProductDto } from '../../products/dtos/product.dto';
import { CategoryDto } from '../../categories/dtos/category.dto';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  type: UserType;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  verification: number;

  @Expose()
  @Transform(({ value }) =>
    !value ? null : Constants.baseUrl + Constants.usersImagesUrl + value,
  )
  image: string;

  @Expose()
  bio: string;

  @Expose()
  isNotificationsEnabled: boolean;

  @Expose()
  status: UserStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @Expose()
  @Type(() => ProductDto)
  products: ProductDto[];

  @Expose()
  @Type(() => FavoriteDto)
  favorites: FavoriteDto[];

  // @Expose()
  // @Type(() => OrderDto)
  // ordersFromBuyers: OrderDto[];
  //
  // @Expose()
  // @Type(() => OrderDto)
  // ordersFromSellers: OrderDto[];
  //
  // @Expose()
  // @Type(() => ChatDto)
  // chatsAsBuyer: ChatDto[];
  //
  // @Expose()
  // @Type(() => ChatDto)
  // chatsAsSeller: ChatDto[];
  //
  // @Expose()
  // @Type(() => MessageDto)
  // messagesAsSender: MessageDto[];
  //
  // @Expose()
  // @Type(() => MessageDto)
  // messagesAsReceiver: MessageDto[];
  //
  // @Expose()
  // @Type(() => CommentDto)
  // commentsAsSeller: CommentDto[];
  //
  // @Expose()
  // @Type(() => CommentDto)
  // commentsAsBuyer: CommentDto[];

  @Expose()
  @Type(() => AdminsRolesDto)
  adminsRoles: AdminsRolesDto[];
}
