import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../shared/users/entities/user.entity';
import { UsersService } from '../../shared/users/users.service';
import { UserType } from '../../shared/users/enums/user-type.enum';
import { SignInWithEmailPasswordDto } from '../../shared/auth/dtos/sign-in-with-email-password.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // sign in with email and password.
  async signInWithEmailAndPassword(signInDto: SignInWithEmailPasswordDto) {
    const user: User = await this.usersService.findByEmail(
      signInDto.email,
      UserType.ADMIN,
      true,
      { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
    );
    if (!user || !(await user.comparePassword(signInDto.password))) {
      throw new NotFoundException('Wrong credentials');
    }
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      type: user.type,
      adminsRoles: user.adminsRoles,
    });
    delete user.password;
    return { ...user, accessToken };
  }
}
