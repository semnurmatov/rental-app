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
import { FOLDERS } from 'src/image/cloudinary/constants';
import { GetUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.getUser(id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  public async updateUser(@Body() data: UpdateUserDto): Promise<GetUserDto> {
    return this.userService.updateUser(data);
  }

  @Patch('/avatar/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GetUserDto> {
    return this.userService.uploadUserAvatar(id, file);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.deleteUser(id);
  }
}
