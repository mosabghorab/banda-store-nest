import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../shared/users/entities/user.entity';
import { UsersService } from '../../shared/users/users.service';
import { UserType } from '../../shared/users/enums/user-type.enum';
import { SignInWithEmailPasswordDto } from '../../shared/auth/dtos/sign-in-with-email-password.dto';
import { CheckPhoneDto } from '../../shared/auth/dtos/check-phone.dto';
import { SignInWithPhoneDto } from '../../shared/auth/dtos/sign-in-with-phone.dto';
import { CustomerSignUpDto } from './dios/customer-sign-up.dto';

@Injectable()
export class CustomerAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // sign in.
  async signInWithEmailAndPassword(signInDto: SignInWithEmailPasswordDto) {
    const user: User = await this.usersService.findByEmail(
      signInDto.email,
      UserType.CUSTOMER,
      true,
    );
    if (!user || !(await user.comparePassword(signInDto.password))) {
      throw new NotFoundException('Wrong credentials');
    }
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      type: user.type,
    });
    delete user.password;
    return { ...user, accessToken };
  }

  // check phone.
  async checkPhone(checkPhoneDto: CheckPhoneDto) {
    const user = await this.usersService.findByPhone(
      checkPhoneDto.phone,
      UserType.CUSTOMER,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // submit code.
  async submitCode(submitCodeDto: SignInWithPhoneDto) {
    const user: User = await this.usersService.findByPhone(
      submitCodeDto.phone,
      UserType.CUSTOMER,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      type: user.type,
    });
    return { ...user, accessToken };
  }

  // sign up.
  signUp(customerSignUpDto: CustomerSignUpDto, files?: any) {
    return this.usersService.create(customerSignUpDto, files);
  }
}
