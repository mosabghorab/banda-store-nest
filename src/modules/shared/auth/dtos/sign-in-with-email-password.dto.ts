import { IsEmail, IsString } from 'class-validator';

export class SignInWithEmailPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
