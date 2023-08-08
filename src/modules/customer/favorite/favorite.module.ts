import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductsModule } from '../../shared/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), ProductsModule],
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
