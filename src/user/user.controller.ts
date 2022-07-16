import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FOLDERS } from 'src/file-system/cloudinary/constants';
import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  public async updateUser(@Body() data: UserDto): Promise<UserDto> {
    return this.userService.updateUser(data);
  }

  @Patch('/avatar/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.userService.uploadUserAvatar(id, file);
  }

  //@TODO Delete User Avatar

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.deleteUser(id);
  }
}
