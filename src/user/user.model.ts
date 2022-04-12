import {
  AllowNull,
  Column,
  HasMany,
  IsDate,
  IsUrl,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';
import { Review } from 'src/review/review.model';
import { GenderType } from './types/gender.type';

@Table
export class User extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  userId: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @Column
  phoneNumber: string;

  @Column({ values: [GenderType.Male, GenderType.Female, GenderType.Other] })
  gender: string;

  @IsDate
  @Column
  birthDate: string;

  @IsUrl
  @Column
  avatar: string;

  @Column
  lattitude: string;

  @Column
  longitude: string;

  @Column
  refreshToken: string;

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Review)
  reviews: Review[];
}
