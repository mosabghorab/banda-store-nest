import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateAdDto {
  @IsString()
  @Length(3, 20)
  title: string;

  @IsString()
  @Length(3, 50)
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive: boolean;
}
