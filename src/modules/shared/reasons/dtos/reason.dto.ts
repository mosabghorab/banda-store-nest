import { Expose, Type } from 'class-transformer';
import { ReportDto } from '../../reports/dto/report.dto';

export class ReasonDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ReportDto)
  reports: ReportDto[];
}
