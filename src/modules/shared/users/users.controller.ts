import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from './enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { CreateOrUpdateUserUploadedFilesDto } from './dtos/create-or-update-user-uploaded-files.dto';

@PermissionsTarget(PermissionsGroups.USERS)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(UserDto, 'User created successfully.')
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles()
    createOrUpdateUserUploadedFilesDto: CreateOrUpdateUserUploadedFilesDto,
  ) {
    const user = await this.usersService.create(
      createUserDto,
      createOrUpdateUserUploadedFilesDto,
    );
    // trigger user.created event.
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(
        `${user.firstName}${user.lastName}`,
        user.email,
        user.phone,
      ),
    );
    return user;
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(UserDto, 'All users.')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(UserDto, 'One user.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(UserDto, 'User updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @UploadedFiles()
    createOrUpdateUserUploadedFilesDto: CreateOrUpdateUserUploadedFilesDto,
  ) {
    return this.usersService.update(
      id,
      body,
      createOrUpdateUserUploadedFilesDto,
    );
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(UserDto, 'User deleted successfully.')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
