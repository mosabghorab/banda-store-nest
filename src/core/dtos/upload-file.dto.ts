import { IsEnum, IsNumber, IsObject, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { FileExtension } from '../enums/file-extension.enum';

export class UploadFileDto {
  @IsString()
  name: string;

  @IsObject()
  data: string;

  @Max(10 * 1024 * 1024) // 10 mb
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  size: number;

  @IsEnum(FileExtension)
  mimetype: FileExtension;

  mv: any;

  static fromFile(file) {
    if (!file) return null;
    const dto = new UploadFileDto();
    dto.name = file.name;
    dto.data = file.data;
    dto.size = file.size;
    dto.mimetype = file.mimetype;
    dto.mv = file.mv;
    return dto;
  }
}
