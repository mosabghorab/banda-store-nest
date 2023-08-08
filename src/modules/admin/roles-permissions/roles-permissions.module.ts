import { Module } from '@nestjs/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesPermissions } from './entities/roles-permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolesPermissions])],
  providers: [RolesPermissionsService],
  exports: [RolesPermissionsService],
})
export class RolesPermissionsModule {}
