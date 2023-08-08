import { forwardRef, Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    forwardRef(() => ProductsModule),
  ],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
