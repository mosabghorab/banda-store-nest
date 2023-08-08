import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { UsersModule } from '../../shared/users/users.module';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
  imports: [UsersModule],
})
export class AdminAuthModule {}
