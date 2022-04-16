import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { Product } from './product.model';
import { productProviders } from './product.providers';
import { ProductService } from './product.service';

@Module({
  imports: [UserModule, SequelizeModule.forFeature([Product])],
  providers: [ProductService, ...productProviders],
  controllers: [ProductController],
})
export class ProductModule {}
