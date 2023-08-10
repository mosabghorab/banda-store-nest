import { IsOptional, ValidateNested } from 'class-validator';
import { UploadImageDto } from '../../../../core/dtos/upload-image.dto';
import { Type } from 'class-transformer';

export class CreateOrUpdateUserUploadedFilesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UploadImageDto)
  image: UploadImageDto;
}
