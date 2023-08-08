import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminsRoles } from './entities/admins-roles.entity';

@Injectable()
export class AdminsRolesService {
  constructor(
    @InjectRepository(AdminsRoles)
    private readonly repo: Repository<AdminsRoles>,
  ) {}

  async create(userId: number, rolesIds: number[]) {
    const usersRoles: AdminsRoles[] = [];
    for (const roleId of rolesIds) {
      usersRoles.push(
        await this.repo.create({
          userId,
          roleId,
        }),
      );
    }
    return usersRoles;
  }

  async removeByUserId(userId: number) {
    const usersRoles = await this.repo.find({ where: { userId } });
    for (const userRole of usersRoles) {
      await this.repo.remove(userRole);
    }
    return true;
  }
}
