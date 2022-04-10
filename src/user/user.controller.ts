import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async createUser(@Body() createUser: UserType): Promise<User> {
  //   const userModel = this.userService.createUser(createUser);
  //   console.log('User: ', userModel);

  //   return userModel;
  // }

  // @Post('/register')
  // public async register(@Body() body: RegisterBody): Promise<void> {
  //   const register = await this.userService.register(
  //     body.username,
  //     body.password,
  //   );
  // }
}
