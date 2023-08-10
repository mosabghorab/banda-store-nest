import { IsNotEmpty, ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';
import { Type } from 'class-transformer';

export class CreateCategoryUploadedFilesDto {
  @IsNotEmpty()
  @ValidateNested({ message: 'image is required' })
  @Type(() => UploadImageDto)
  image: UploadImageDto;
}
