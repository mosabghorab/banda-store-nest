import { IsOptional, ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';

export class CreateOrUpdateUserUploadFilesDto {
  @IsOptional()
  @ValidateNested()
  image: UploadImageDto;
}
