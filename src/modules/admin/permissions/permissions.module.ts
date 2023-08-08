import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionsModule {}
