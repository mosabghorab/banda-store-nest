import { IsOptional, ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';

export class UpdateProductUploadFilesDto {
  @IsOptional()
  @ValidateNested()
  mainImage: UploadImageDto;

  @IsOptional()
  @ValidateNested({ each: true })
  images: UploadImageDto[];
}
