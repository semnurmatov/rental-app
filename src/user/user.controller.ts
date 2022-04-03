import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBody } from './types/RegisterBody';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  public async register(@Body() body: RegisterBody): Promise<void> {
    const register = await this.userService.register(body.username, body.password);

  }
}
