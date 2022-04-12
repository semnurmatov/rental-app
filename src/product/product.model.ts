import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Image } from 'src/image/image.model';
import { Review } from 'src/review/review.model';
import { User } from 'src/user/user.model';

@Table
export class Product extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AutoIncrement
  @Column
  productId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  userId: number;

  @AllowNull(false)
  @Column
  title: string;

  @Column(DataType.STRING(3000))
  description: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => Review)
  reviews: Review[];
}
