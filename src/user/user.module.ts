import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserFactory } from './user.factory';
import { User } from './user.model';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserFactory, ...userProviders],
  exports: [UserService, ...userProviders],
})
export class UserModule {}
