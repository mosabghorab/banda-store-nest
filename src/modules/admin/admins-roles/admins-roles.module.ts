import { Module } from '@nestjs/common';
import { AdminsRolesService } from './admins-roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsRoles } from './entities/admins-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsRoles])],
  providers: [AdminsRolesService],
  exports: [AdminsRolesService],
})
export class AdminsRolesModule {}
