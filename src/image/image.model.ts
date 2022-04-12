import {
  AllowNull,
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
  @Column
  imageId: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ onUpdate: 'CASCADE' })
  productId: string;

  @AllowNull(false)
  @IsUrl
  @Column
  imageUrl: string;

  @BelongsTo(() => Product)
  product: Product;
}
