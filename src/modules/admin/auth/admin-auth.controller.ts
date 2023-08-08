import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { Public } from '../../shared/auth/metadata/public.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserDto } from '../../shared/users/dtos/user.dto';
import { SignInWithEmailPasswordDto } from '../../shared/auth/dtos/sign-in-with-email-password.dto';

@Public()
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Serialize(UserDto, 'You signed in successfully')
  @Post('sign-in-with-email-password')
  async signIn(@Body() signInDto: SignInWithEmailPasswordDto) {
    return this.authService.signInWithEmailAndPassword(signInDto);
  }
}
