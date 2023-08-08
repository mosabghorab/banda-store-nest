import { IsPhoneNumber } from 'class-validator';

export class CheckPhoneDto {
  @IsPhoneNumber()
  phone: string;
}
