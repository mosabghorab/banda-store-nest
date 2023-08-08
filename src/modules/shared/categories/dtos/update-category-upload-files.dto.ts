import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryUploadedFilesDto } from './create-category-upload-files.dto';

export class UpdateCategoryUploadedFilesDto extends PartialType(CreateCategoryUploadedFilesDto) {
}
