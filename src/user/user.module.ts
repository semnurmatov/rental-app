import { Module } from '@nestjs/common';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserFactory } from './user.factory';
import { UserService } from './user.service';

@Module({
  imports: [ImageModule],
  controllers: [UserController],
  providers: [UserService, UserFactory, ImageService, PrismaService],
  exports: [UserService, UserFactory],
})
export class UserModule {}
