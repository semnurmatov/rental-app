import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UserModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
