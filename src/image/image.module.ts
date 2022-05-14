import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { memoryStorage } from 'multer';
import { FileSystemService } from './cloudinary/file-system.service';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { Image } from './image.model';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
    SequelizeModule.forFeature([Image]),
  ],
  controllers: [ImageController],
  providers: [ImageService, FileSystemService, CloudinaryProvider],
  exports: [ImageService, FileSystemService],
})
export class ImageModule {}
