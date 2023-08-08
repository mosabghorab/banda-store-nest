import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { PermissionsTarget } from '../../admin/permissions/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../../admin/permissions/enums/permissions-groups.enum';
import { AllowFor } from '../auth/metadata/allow-for.metadata';
import { UserType } from '../users/enums/user-type.enum';
import { AdminMustCanDo } from '../../admin/permissions/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../../admin/permissions/enums/permissions-actions.enum';

@PermissionsTarget(PermissionsGroups.REPORTS)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @AllowFor(UserType.CUSTOMER)
  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(ReportDto, 'Report created successfully.')
  @Post()
  async create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ReportDto, 'All reports.')
  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(ReportDto, 'One report.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.reportsService.findOneById(id);
  }

  @AllowFor(UserType.ADMIN)
  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(ReportDto, 'Report deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.reportsService.remove(id);
  }
}
