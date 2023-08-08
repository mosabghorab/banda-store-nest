import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingDto } from './dto/setting.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';
import { Public } from '../auth/metadata/public.metadata';

@PermissionsTarget(PermissionsGroups.SETTINGS)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(SettingDto, 'Setting created successfully.')
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Public()
  @Serialize(SettingDto, 'All settings.')
  @Get()
  async findAll() {
    return this.settingsService.findAll();
  }

  @Public()
  @Serialize(SettingDto, 'One setting.')
  @Get(':key')
  async findOne(@Param('key') key: string) {
    return this.settingsService.findOneByKey(key);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(SettingDto, 'Setting updated successfully.')
  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(key, updateSettingDto);
  }
}
