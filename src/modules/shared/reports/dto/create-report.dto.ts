import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReportDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  reasonId: number;

  @IsString()
  text: string;
}
