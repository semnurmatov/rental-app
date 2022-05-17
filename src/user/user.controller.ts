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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.getUser(id);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<GetUserDto> {
    return this.userService.updateUser(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.deleteUser(id);
  }
}
