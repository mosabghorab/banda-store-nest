import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesPermissions } from './entities/roles-permissions.entity';

@Injectable()
export class RolesPermissionsService {
  constructor(
    @InjectRepository(RolesPermissions)
    private readonly repo: Repository<RolesPermissions>,
  ) {}

  async create(roleId: number, permissionsIds: number[]) {
    const rolesPermissions: RolesPermissions[] = [];
    for (const permissionId of permissionsIds) {
      rolesPermissions.push(
        await this.repo.create({
          roleId,
          permissionId,
        }),
      );
    }
    return rolesPermissions;
  }

  async removeByRoleId(roleId: number) {
    const rolesPermissions = await this.repo.find({ where: { roleId } });
    for (const rolePermission of rolesPermissions) {
      await this.repo.remove(rolePermission);
    }
    return true;
  }
}
