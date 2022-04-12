import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  IsUrl,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';

@Table
export class Image extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AutoIncrement
  @Column
  imageId: number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  productId: number;

  @AllowNull(false)
  @IsUrl
  @Column
  imageUrl: string;

  @BelongsTo(() => Product)
  product: Product;
}
