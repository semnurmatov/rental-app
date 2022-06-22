import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileSystemService } from './file-system.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { FileSystemController } from './file-system.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
  ],
  controllers: [FileSystemController],
  providers: [FileSystemService, CloudinaryProvider],
  exports: [FileSystemService],
})
export class FileSystemModule {}
