import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FOLDERS } from 'src/image/cloudinary/constants';
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

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadUsersImage(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadImage(file, FOLDERS.USERS);
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
