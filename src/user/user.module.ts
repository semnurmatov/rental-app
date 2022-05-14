import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';
import { UserController } from './user.controller';
import { UserFactory } from './user.factory';
import { User } from './user.model';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), ImageModule],
  controllers: [UserController],
  providers: [UserService, UserFactory, ...userProviders, ImageService],
  exports: [UserService, UserFactory],
})
export class UserModule {}
