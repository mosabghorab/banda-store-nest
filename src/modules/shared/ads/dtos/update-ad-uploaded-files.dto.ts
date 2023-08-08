import { PartialType } from '@nestjs/mapped-types';
import { CreateAdUploadedFilesDto } from './create-ad-uploaded-files.dto';

export class UpdateAdUploadedFilesDto extends PartialType(
  CreateAdUploadedFilesDto,
) {}
