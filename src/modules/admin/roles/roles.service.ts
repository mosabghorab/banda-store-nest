import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  // create.
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(createRoleDto);
    const rolesPermissions = await this.rolesPermissionsService.create(
      role.id,
      createRoleDto.permissionsIds,
    );
    role.rolesPermissions = rolesPermissions;
    return this.roleRepository.save(role);
  }

  // find all.
  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: { rolesPermissions: true } });
  }

  // find one by id.
  findOneById(id: number): Promise<Role> {
    return this.roleRepository.findOne({
      where: { id },
    });
  }

  // update.
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (updateRoleDto.permissionsIds) {
      await this.rolesPermissionsService.removeByRoleId(role.id);
      role.rolesPermissions = await this.rolesPermissionsService.create(
        role.id,
        updateRoleDto.permissionsIds,
      );
    }
    delete updateRoleDto.permissionsIds;
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  // remove.
  async remove(id: number): Promise<Role> {
    const role = await this.findOneById(id);
    if (!role) {
      throw new BadRequestException('Please provide a valid role id');
    }
    return this.roleRepository.remove(role);
  }
}
