import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryDto } from './dtos/category.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { Public } from '../auth/metadata/public.metadata';
import { AuthedUser } from '../auth/types/authed-user.type';
import { GetAuthedUser } from '../auth/custom-decorators/auth-user-decorator';
import { CreateCategoryUploadedFilesDto } from './dtos/create-category-uploaded-files.dto';
import { UpdateCategoryUploadedFilesDto } from './dtos/update-category-uploaded-files.dto';

@PermissionsTarget(PermissionsGroups.CATEGORIES)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(CategoryDto, 'Category created successfully.')
  @Post()
  async create(
    @GetAuthedUser() user: AuthedUser,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles()
    createCategoryUploadedFilesDto: CreateCategoryUploadedFilesDto,
  ) {
    return this.categoriesService.create(
      user.id,
      createCategoryDto,
      createCategoryUploadedFilesDto,
    );
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(CategoryDto, 'Category updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles()
    updateCategoryUploadedFilesDto: UpdateCategoryUploadedFilesDto,
  ) {
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      updateCategoryUploadedFilesDto,
    );
  }

  @Public()
  @Serialize(CategoryDto, 'All Categories.')
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Serialize(CategoryDto, 'One category.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findOneById(id, {
      parent: true,
      subCategories: true,
    });
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(CategoryDto, 'Category deleted successfully.')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }
}
