import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductImageDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @IsString()
  name: string;
}
