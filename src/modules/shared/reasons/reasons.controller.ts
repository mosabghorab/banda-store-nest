import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReasonsService } from './reasons.service';
import { CreateReasonDto } from './dtos/create-reason.dto';
import { UpdateReasonDto } from './dtos/update-reason.dto';
import { ReasonDto } from './dtos/reason.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';

@PermissionsTarget(PermissionsGroups.REASONS)
@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ReasonDto, 'Reason created successfully.')
  @Post()
  async create(@Body() createReasonDto: CreateReasonDto) {
    return this.reasonsService.create(createReasonDto);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(ReasonDto, 'Reason updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReasonDto: UpdateReasonDto,
  ) {
    return this.reasonsService.update(id, updateReasonDto);
  }

  @AllowFor(UserType.ADMIN, UserType.CUSTOMER)
  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  async getAll() {
    return this.reasonsService.findAll();
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(ReasonDto, 'Reason deleted successfully.')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.reasonsService.delete(id);
  }
}
