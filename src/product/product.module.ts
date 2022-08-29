import { Module } from '@nestjs/common';
import { FileSystemModule } from '../file-system/file-system.module';
import { FileSystemService } from '../file-system/file-system.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UserModule, FileSystemModule],
  providers: [ProductService, PrismaService, FileSystemService],
  controllers: [ProductController],
})
export class ProductModule {}
