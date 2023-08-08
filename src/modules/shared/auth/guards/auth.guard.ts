import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PUBLIC_KEY } from '../metadata/public.metadata';
import { can, extractTokenFromHeader } from '../../../../core/helpers';
import { USER_TYPES_KEY } from '../metadata/allow-for.metadata';
import { UserType } from '../../users/enums/user-type.enum';
import { PERMISSION_ACTION_KEY } from '../../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PERMISSIONS_TARGET_KEY } from '../../../admin/permissions/metadata/permissions-target.metadata';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let authUser: AuthUser;
    try {
      authUser = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const userTypes = this.reflector.getAllAndOverride<any>(USER_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!userTypes.some((e) => e == authUser.type))
      throw new ForbiddenException();
    if (authUser.type == UserType.ADMIN) {
      const permissionGroup = this.reflector.getAllAndOverride<any>(
        PERMISSIONS_TARGET_KEY,
        [context.getClass()],
      );
      const permissionAction = this.reflector.getAllAndOverride<any>(
        PERMISSION_ACTION_KEY,
        [context.getHandler()],
      );
      if (!can(permissionAction, permissionGroup, authUser.adminsRoles)) {
        throw new ForbiddenException();
      }
    }
    request.user = authUser;
    return true;
  }
}
