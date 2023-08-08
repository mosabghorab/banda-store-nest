import { IsPhoneNumber, IsString } from 'class-validator';

export class SignInWithPhoneDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  code: string;
}
