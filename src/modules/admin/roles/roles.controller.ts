import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleDto } from './dtos/role.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../permissions/enums/permissions-groups.enum';
import { AllowFor } from '../../shared/auth/metadata/allow-for.metadata';
import { UserType } from '../../shared/users/enums/user-type.enum';
import { AdminMustCanDo } from '../permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../permissions/enums/permissions-actions.enum';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.ROLES)
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(RoleDto, 'Role created successfully.')
  @Post()
  async create(@Body() createAdDto: CreateRoleDto) {
    return this.rolesService.create(createAdDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(RoleDto, 'All roles.')
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(RoleDto, 'Role updated successfully.')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(RoleDto, 'Role deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
