import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AdminsRolesModule } from '../../admin/admins-roles/admins-roles.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersEventsHandler } from './users-events-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AdminsRolesModule,
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersEventsHandler],
  exports: [UsersService],
})
export class UsersModule {}
