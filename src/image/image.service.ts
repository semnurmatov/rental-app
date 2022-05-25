import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { FOLDERS } from './cloudinary/constants';
import { FileSystemService } from './cloudinary/file-system.service';

@Injectable()
export class ImageService {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: FOLDERS,
  ): Promise<UploadApiResponse> {
    const uploadedImage = await this.fileSystemService.uploadFile(file, folder);

    return uploadedImage;
  }

  async uploadImages(
    files: Array<Express.Multer.File>,
    folder: FOLDERS,
  ): Promise<Array<UploadApiResponse>> {
    const images: Array<UploadApiResponse> = [];
    files.forEach(async (file) => {
      const image = await this.fileSystemService.uploadFile(file, folder);
      images.push(image);
    });

    return images;
  }

  async deleteImage(publicId: string): Promise<boolean> {
    return this.fileSystemService.deleteFile(publicId);
  }
}
