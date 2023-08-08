import { Module } from '@nestjs/common';
import { EmailNotificationsService } from './email-notifications.service';
import { SmsNotificationsService } from './sms-notifications.service';
import { NotificationsService } from './notifications.service';

@Module({
  exports: [NotificationsService],
  providers: [
    EmailNotificationsService,
    SmsNotificationsService,
    NotificationsService,
  ],
})
export class NotificationsModule {}
