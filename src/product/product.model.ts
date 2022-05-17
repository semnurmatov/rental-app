// import {
//   AllowNull,
//   BelongsTo,
//   Column,
//   DataType,
//   ForeignKey,
//   HasMany,
//   IsUUID,
//   Model,
//   PrimaryKey,
//   Table,
//   Unique,
// } from 'sequelize-typescript';
// import { Image } from 'src/image/image.model';
// import { Review } from 'src/review/review.model';
// import { User } from 'src/user/user.model';

// @Table
// export class Product extends Model {
//   @PrimaryKey
//   @Unique
//   @IsUUID(4)
//   @Column
//   productId: string;

//   @ForeignKey(() => User)
//   @AllowNull(false)
//   @Column({ onUpdate: 'CASCADE' })
//   userId: string;

//   @AllowNull(false)
//   @Column
//   title: string;

//   @Column(DataType.STRING(3000))
//   description: string;

//   @Column
//   price: number;

//   @BelongsTo(() => User)
//   user: User;

//   @HasMany(() => Image)
//   images: Image[];

//   @HasMany(() => Review)
//   reviews: Review[];
// }
