import { forwardRef, Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductImagesModule } from '../product-images/product-images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UsersModule,
    CategoriesModule,
    forwardRef(() => ProductImagesModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
