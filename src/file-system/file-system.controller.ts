import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse } from 'cloudinary';
import { Public } from '../common';
import { FOLDERS } from './cloudinary/constants';
import { FileSystemService } from './file-system.service';

@Controller('')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @Delete('product/cron/images')
  @HttpCode(HttpStatus.OK)
  public async clearTempFolderWeekly() {
    return this.fileSystemService.clearTempFolderWeekly();
  }
}
