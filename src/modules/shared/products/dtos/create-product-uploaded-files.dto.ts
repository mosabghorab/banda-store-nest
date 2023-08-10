import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';
import { Type } from 'class-transformer';

export class CreateProductUploadedFilesDto {
  @IsNotEmpty()
  @ValidateNested({ message: 'main image is required' })
  @Type(() => UploadImageDto)
  mainImage: UploadImageDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UploadImageDto)
  images: UploadImageDto[];
}
