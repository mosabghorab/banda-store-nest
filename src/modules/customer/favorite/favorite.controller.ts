import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteDto } from './dtos/favorite.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { GetAuthedUser } from '../../shared/auth/custom-decorators/auth-user-decorator';
import { AllowFor } from '../../shared/auth/metadata/allow-for.metadata';
import { UserType } from '../../shared/users/enums/user-type.enum';
import { AuthedUser } from '../../shared/auth/types/authed-user.type';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Serialize(FavoriteDto, 'My favorites.')
  @Get()
  async getMyFavorite(@GetAuthedUser() user: AuthedUser) {
    return this.favoriteService.find(user.id);
  }

  @Serialize(FavoriteDto, 'Product added to favorite successfully.')
  @Post(':id')
  async addToFavorite(
    @GetAuthedUser() user: AuthedUser,
    @Param('id') productId: number,
  ) {
    return this.favoriteService.add(user.id, productId);
  }

  @Serialize(FavoriteDto, 'Product removed from favorite successfully.')
  @Delete(':id')
  async removeFromFavorite(
    @GetAuthedUser() user: AuthedUser,
    @Param('id') productId: number,
  ) {
    return this.favoriteService.remove(user.id, productId);
  }
}
