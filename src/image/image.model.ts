// import {
//   AllowNull,
//   BelongsTo,
//   Column,
//   ForeignKey,
//   IsUrl,
//   IsUUID,
//   Model,
//   PrimaryKey,
//   Table,
// } from 'sequelize-typescript';
// import { Product } from 'src/product/product.model';
// import { User } from 'src/user/user.model';

// @Table
// export class Image extends Model {
//   @PrimaryKey
//   @IsUUID(4)
//   @Column
//   imageId: string;

//   @ForeignKey(() => Product)
//   @Column({ onUpdate: 'CASCADE' })
//   productId: string;

//   @ForeignKey(() => User)
//   @Column({ onUpdate: 'CASCADE' })
//   userId: string;

//   @AllowNull(false)
//   @IsUrl
//   @Column
//   imageUrl: string;

//   @BelongsTo(() => Product)
//   product: Product;
// }
