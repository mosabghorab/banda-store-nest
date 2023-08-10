import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { unlinkSync } from 'fs';
import { FindOptionsRelations } from 'typeorm/browser';
import { Constants } from '../../../core/constants';
import { saveFile } from '../../../core/helpers';
import { AdminsRolesService } from '../../admin/admins-roles/admins-roles.service';
import { UserType } from './enums/user-type.enum';
import { CustomerSignUpDto } from '../../customer/auth/dios/customer-sign-up.dto';
import { DriverSignUpDto } from '../../driver/auth/dios/driver-sign-up.dto';
import { CreateOrUpdateUserUploadedFilesDto } from './dtos/create-or-update-user-uploaded-files.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly usersRolesService: AdminsRolesService,
  ) {}

  // find by email.
  findByEmail(
    email: string,
    type: UserType,
    withPassword?: boolean,
    relations?: FindOptionsRelations<User>,
  ) {
    return this.repo.findOne({
      where: {
        email,
        type,
      },
      select: withPassword ? this._getCols() : null,
      relations: relations,
    });
  }

  // find by phone.
  findByPhone(
    phone: string,
    type: UserType,
    relations?: FindOptionsRelations<User>,
  ) {
    return this.repo.findOne({
      where: { phone, type },
      relations: relations,
    });
  }

  // create.
  async create(
    dto: CreateUserDto | CustomerSignUpDto | DriverSignUpDto,
    createOrUpdateUserUploadedFilesDto: CreateOrUpdateUserUploadedFilesDto,
  ) {
    const userByPhone = await this.findByPhone(dto.phone, dto.type);
    if (userByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const userByEmail = await this.findByEmail(dto.email, dto.type);
    if (userByEmail) {
      throw new BadRequestException('Email is already exists.');
    }
    if (createOrUpdateUserUploadedFilesDto.image) {
      await saveFile(
        Constants.usersImagesPath,
        createOrUpdateUserUploadedFilesDto.image.name,
        createOrUpdateUserUploadedFilesDto.image,
      );
      dto.image = createOrUpdateUserUploadedFilesDto.image.name;
    }
    const userToCreate = await this.repo.create(dto);
    if (dto.type == UserType.ADMIN) {
      const adminsRoles = await this.usersRolesService.create(
        userToCreate.id,
        (dto as CreateUserDto).rolesIds,
      );
      userToCreate.adminsRoles = adminsRoles;
    }
    const createdUser = await this.repo.save(userToCreate);
    delete createdUser.password;
    return createdUser;
  }

  // find all.
  findAll(relations?: FindOptionsRelations<User>) {
    return this.repo.find({ relations });
  }

  // find one by id.
  async findOneById(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  // update.
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    createOrUpdateUserUploadedFilesDto: CreateOrUpdateUserUploadedFilesDto,
  ) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (updateUserDto.phone) {
      const userByPhone = await this.findByPhone(
        updateUserDto.phone,
        updateUserDto.type,
      );
      if (userByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateUserDto.email) {
      const userByEmail = await this.findByEmail(
        updateUserDto.email,
        updateUserDto.type,
      );
      if (userByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    if (createOrUpdateUserUploadedFilesDto.image) {
      await saveFile(
        Constants.usersImagesPath,
        createOrUpdateUserUploadedFilesDto.image.name,
        createOrUpdateUserUploadedFilesDto.image,
      );
      unlinkSync(Constants.usersImagesPath + user.image);
      updateUserDto.image = createOrUpdateUserUploadedFilesDto.image.name;
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.repo.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  // delete.
  async delete(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.repo.remove(user);
  }

  // get all properties names od user entity.
  private _getCols(): (keyof User)[] {
    return this.repo.metadata.columns.map(
      (col) => col.propertyName,
    ) as (keyof User)[];
  }
}
