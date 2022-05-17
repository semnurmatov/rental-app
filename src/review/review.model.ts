// import {
//   AllowNull,
//   BelongsTo,
//   Column,
//   DataType,
//   ForeignKey,
//   IsUUID,
//   Model,
//   PrimaryKey,
//   Table,
//   Unique,
// } from 'sequelize-typescript';
// import { Product } from 'src/product/product.model';
// import { User } from 'src/user/user.model';

// @Table
// export class Review extends Model {
//   @PrimaryKey
//   @IsUUID(4)
//   @Column
//   reviewId: string;

//   @ForeignKey(() => User)
//   @AllowNull(false)
//   @Column({ onUpdate: 'CASCADE' })
//   ownerId: string;

//   @ForeignKey(() => User)
//   @AllowNull(false)
//   @Column({ onUpdate: 'CASCADE' })
//   reviewerId: string;

//   @ForeignKey(() => Product)
//   @AllowNull(false)
//   @Column({ onUpdate: 'CASCADE' })
//   productId: string;

//   @Column(DataType.STRING(4000))
//   comments: string;

//   @BelongsTo(() => User, 'ownerId')
//   owner: User;

//   @BelongsTo(() => User, 'reviewerId')
//   reviewer: User;

//   @BelongsTo(() => Product)
//   product: Product;
// }
