import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { Public } from '../../shared/auth/metadata/public.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UserDto } from '../../shared/users/dtos/user.dto';
import { CheckPhoneDto } from '../../shared/auth/dtos/check-phone.dto';
import { SignInWithEmailPasswordDto } from '../../shared/auth/dtos/sign-in-with-email-password.dto';
import { SignInWithPhoneDto } from '../../shared/auth/dtos/sign-in-with-phone.dto';
import { CustomerSignUpDto } from './dios/customer-sign-up.dto';

@Public()
@Controller('customer/auth')
export class CustomerAuthController {
  constructor(private readonly authService: CustomerAuthService) {}

  @Serialize(UserDto, 'Phone is exist.')
  @Post('check-phone')
  async checkPhone(@Body() checkPhoneDto: CheckPhoneDto) {
    return this.authService.checkPhone(checkPhoneDto);
  }

  @Serialize(UserDto, 'You signed in successfully')
  @Post('sign-in-with-email-password')
  async signIn(@Body() signInDto: SignInWithEmailPasswordDto) {
    return this.authService.signInWithEmailAndPassword(signInDto);
  }

  @Serialize(UserDto, 'You signed in successfully')
  @Post('sign-in-with-phone')
  async submitCode(@Body() submitCodeDto: SignInWithPhoneDto) {
    return this.authService.submitCode(submitCodeDto);
  }

  @Serialize(UserDto, 'You signed up successfully')
  @Post('signup')
  async signUp(
    @Body() customerSignUpDto: CustomerSignUpDto,
    @UploadedFiles() files?: any,
  ) {
    return this.authService.signUp(customerSignUpDto, files);
  }
}
