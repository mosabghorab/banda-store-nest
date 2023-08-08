import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  parentId: number;

  @IsString()
  name: string;
}
