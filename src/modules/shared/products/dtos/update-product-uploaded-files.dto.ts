import { PartialType } from '@nestjs/mapped-types';
import { CreateProductUploadedFilesDto } from './create-product-uploaded-files.dto';

export class UpdateProductUploadedFilesDto extends PartialType(
  CreateProductUploadedFilesDto,
) {}
