import { isUUID } from 'class-validator';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';
import { User } from 'src/user/user.model';

@Table
export class Review extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AutoIncrement
  @Column
  reviewId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  ownerId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  reviewerId: number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  productId: number;

  @Column(DataType.STRING(4000))
  comments: string;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsTo(() => User, 'reviewerId')
  reviewer: User;

  @BelongsTo(() => Product)
  product: Product;
}
