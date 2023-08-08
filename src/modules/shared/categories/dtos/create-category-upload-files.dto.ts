import { ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';

export class CreateCategoryUploadedFilesDto {
  @ValidateNested({ message: 'image is required' })
  image: UploadImageDto;
}
