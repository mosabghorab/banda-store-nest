import { Module } from '@nestjs/common';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { UsersModule } from '../../shared/users/users.module';

@Module({
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService],
  imports: [UsersModule],
})
export class CustomerAuthModule {}
