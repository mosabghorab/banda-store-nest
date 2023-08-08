import { PartialType } from '@nestjs/mapped-types';
import { CreateReasonDto } from './create-reason.dto';

export class UpdateReasonDto extends PartialType(CreateReasonDto) {}
