import { Module } from '@nestjs/common';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { FileSystemService } from 'src/file-system/file-system.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
