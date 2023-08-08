import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEnum(UserType)
  type: UserType;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  image: string;

  @ValidateIf((obj) => obj.type === UserType.ADMIN)
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  rolesIds: number[];
}
