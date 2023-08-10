import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FilterProductsDto } from './dtos/filter-products.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductDto } from './dtos/product.dto';
import { ProductsWithPaginationDto } from './dtos/products-with-pagination.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { GetAuthedUser } from '../auth/custom-decorators/auth-user-decorator';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';
import { Public } from '../auth/metadata/public.metadata';
import { AuthedUser } from '../auth/types/authed-user.type';

@PermissionsTarget(PermissionsGroups.PRODUCTS)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ProductDto, 'Product created successfully.')
  @Post()
  async create(
    @GetAuthedUser() user: AuthedUser,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: any,
  ) {
    return this.productsService.create(user.id, createProductDto, files);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ProductDto, 'Products created successfully.')
  @Post('fake')
  async generateFake(
    @GetAuthedUser() user: AuthedUser,
    @Query('count') count: number,
  ) {
    return this.productsService.generateFake(user.id, count);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(ProductDto, 'Product updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: any,
  ) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @Public()
  @Serialize(ProductDto, 'One product.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productsService.findOneById(id);
  }

  @Public()
  @Serialize(ProductsWithPaginationDto, 'All products.')
  @Get()
  async findAll(@Query() filterProductsDto: FilterProductsDto) {
    return this.productsService.findAll(filterProductsDto);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(ProductDto, 'Product deleted successfully.')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
}
