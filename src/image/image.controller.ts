import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse } from 'cloudinary';
import { Public } from '../common';
import { FOLDERS } from './cloudinary/constants';
import { ImageService } from './image.service';

@Controller('')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // @Public()
  // @Post('/image')
  // @UseInterceptors(FileInterceptor('file'))
  // public async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() folder: FOLDERS,
  // ) {
  //   return this.imageService.uploadImage(file, folder);
  // }

  // @Post('/images')
  // @UseInterceptors(FilesInterceptor('files'))
  // public async uploadImages(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() folder: FOLDERS,
  // ): Promise<Array<UploadApiResponse>> {
  //   return this.imageService.uploadImages(files, folder);
  // }
}
