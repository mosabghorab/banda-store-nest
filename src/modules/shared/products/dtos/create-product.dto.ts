import { IsBoolean, IsJSON, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  subCategoryId: number;

  @IsJSON()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  discount: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isBestOffers: boolean;
}
