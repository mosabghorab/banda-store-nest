import { Injectable } from '@nestjs/common';
import { EmailNotificationsService } from './email-notifications.service';
import { SmsNotificationsService } from './sms-notifications.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailNotificationsService: EmailNotificationsService,
    private readonly smsNotificationsService: SmsNotificationsService,
  ) {}

  sendEmail(receiver: string, title: string, content: string) {
    this.emailNotificationsService.send(receiver, title, content);
  }

  sendSms(receiver: string, title: string, content: string) {
    this.smsNotificationsService.send(receiver, title, content);
  }
}
