export class UserCreatedEvent {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
  ) {}
}
