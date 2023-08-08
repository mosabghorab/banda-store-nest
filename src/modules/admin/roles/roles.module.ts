import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), RolesPermissionsModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
