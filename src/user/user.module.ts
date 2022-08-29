import { Module } from '@nestjs/common';
import { FileSystemModule } from '../file-system/file-system.module';
import { FileSystemService } from '../file-system/file-system.service';
import { PrismaService } from '../prisma/prisma.service';

import { UserController } from './user.controller';
import { UserFactory } from './user.factory';
import { UserService } from './user.service';

@Module({
  imports: [FileSystemModule],
  controllers: [UserController],
  providers: [UserService, UserFactory, FileSystemService, PrismaService],
  exports: [UserService, UserFactory],
})
export class UserModule {}
