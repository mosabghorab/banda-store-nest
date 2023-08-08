import { Expose, Type } from 'class-transformer';
import { RoleDto } from '../../roles/dtos/role.dto';
import { UserDto } from '../../../shared/users/dtos/user.dto';

export class AdminsRolesDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  roleId: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
