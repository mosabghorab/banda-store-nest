import { Expose, Transform } from 'class-transformer';
import { Constants } from '../../../../core/constants';

export class AdDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ value }) => Constants.baseUrl + Constants.adsImagesUrl + value)
  image: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
