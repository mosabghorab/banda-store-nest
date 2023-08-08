import { Module } from '@nestjs/common';
import { DriverAuthController } from './driver-auth.controller';
import { DriverAuthService } from './driver-auth.service';
import { UsersModule } from '../../shared/users/users.module';

@Module({
  controllers: [DriverAuthController],
  providers: [DriverAuthService],
  imports: [UsersModule],
})
export class DriverAuthModule {}
