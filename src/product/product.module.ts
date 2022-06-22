import { Module } from '@nestjs/common';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { FileSystemService } from 'src/file-system/file-system.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UserModule, FileSystemModule],
  providers: [ProductService, PrismaService, FileSystemService],
  controllers: [ProductController],
})
export class ProductModule {}
