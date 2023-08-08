import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailNotificationsService {
  send(receiver: string, title: string, content: string) {
    console.log('email sent');
    console.log(receiver);
    console.log(title);
    console.log(content);
  }
}
