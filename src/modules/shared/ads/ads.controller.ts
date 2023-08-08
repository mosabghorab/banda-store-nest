import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { UpdateAdDto } from './dtos/update-ad.dto';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdDto } from './dtos/ad.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';
import { Public } from '../auth/metadata/public.metadata';

@PermissionsTarget(PermissionsGroups.ADS)
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(AdDto, 'Ad created successfully.')
  @Post()
  async create(@Body() createAdDto: CreateAdDto, @UploadedFiles() files: any) {
    return this.adsService.create(createAdDto, files);
  }

  @Public()
  @Serialize(AdDto, 'All ads.')
  @Get()
  async findAll() {
    return this.adsService.findAll();
  }

  @Public()
  @Serialize(AdDto, 'One ad.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adsService.findOneById(id);
  }

  @Public()
  @Get(':id/image')
  async findImage(@Res({ passthrough: true }) res, @Param('id') id: number) {
    const { fileExt, streamableFile } = await this.adsService.findImageById(id);
    res.set({
      'Content-Disposition': `attachment; filename="ad-image.${fileExt}"`,
    });
    return streamableFile;
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(AdDto, 'Ad updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAdDto: UpdateAdDto,
    @UploadedFiles() files: any,
  ) {
    return this.adsService.update(id, updateAdDto, files);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(AdDto, 'Ad deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.adsService.remove(id);
  }
}
