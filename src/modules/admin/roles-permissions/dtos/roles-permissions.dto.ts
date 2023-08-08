import { Expose, Type } from 'class-transformer';
import { PermissionDto } from '../../permissions/dtos/permission.dto';
import { RoleDto } from '../../roles/dtos/role.dto';

export class RolesPermissionsDto {
  @Expose()
  id: number;

  @Expose()
  roleId: number;

  @Expose()
  permissionId: number;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;

  @Expose()
  @Type(() => PermissionDto)
  permission: PermissionDto;
}
