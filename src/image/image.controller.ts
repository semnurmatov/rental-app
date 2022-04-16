import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common';

@Controller('image')
export class ImageController {
  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', { dest: './src/image/local-storage/' }),
  )
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
