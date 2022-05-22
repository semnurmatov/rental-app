import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileSystemService } from './cloudinary/file-system.service';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, FileSystemService, CloudinaryProvider],
  exports: [ImageService, FileSystemService],
})
export class ImageModule {}
