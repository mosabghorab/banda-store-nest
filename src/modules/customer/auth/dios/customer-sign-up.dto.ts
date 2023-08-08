import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserType } from '../../../shared/users/enums/user-type.enum';

export class CustomerSignUpDto {
  type: UserType = UserType.CUSTOMER;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  image: string;
}
