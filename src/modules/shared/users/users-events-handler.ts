import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersEventsHandler {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('user.created')
  handleUserCreatedEvent(userCreatedEvent: UserCreatedEvent) {
    this._sendWelcomingEmail(userCreatedEvent.name, userCreatedEvent.email);
    this._sendWelcomingSms(userCreatedEvent.name, userCreatedEvent.phone);
  }

  private _sendWelcomingEmail(name: string, email: string) {
    this.notificationsService.sendEmail(
      email,
      'Welcome to banda store app',
      'we are welcoming you to our beautiful system ' + name,
    );
  }

  private _sendWelcomingSms(name: string, phone: string) {
    this.notificationsService.sendSms(
      phone,
      'Welcome to banda store app',
      'we are welcoming you to our beautiful system ' + name,
    );
  }
}
