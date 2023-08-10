import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryUploadedFilesDto } from './create-category-uploaded-files.dto';

export class UpdateCategoryUploadedFilesDto extends PartialType(
  CreateCategoryUploadedFilesDto,
) {}
