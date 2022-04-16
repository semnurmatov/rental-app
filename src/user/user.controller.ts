import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { GetUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  public async getUser(@Param('userId') userId: string): Promise<GetUserDto> {
    return this.userService.getUser(userId);
  }

  @Patch('/:userId')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('userId') userId: string,
    @Body() body: Partial<UpdateUserDto>,
  ): Promise<GetUserDto> {
    return this.userService.updateUser(userId, body);
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param('userId') userId: string): Promise<boolean> {
    return this.userService.deleteUser(userId);
  }
}
