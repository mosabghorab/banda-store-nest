import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsNotificationsService {
  send(receiver: string, title: string, content: string) {
    console.log('sms sent');
    console.log(receiver);
    console.log(title);
    console.log(content);
  }
}
