import { Expose, Type } from 'class-transformer';
import { ProductDto } from '../../products/dtos/product.dto';
import { ReasonDto } from '../../reasons/dtos/reason.dto';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  reasonId: number;

  @Expose()
  text: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  @Expose()
  @Type(() => ReasonDto)
  reason: ReasonDto;
}
