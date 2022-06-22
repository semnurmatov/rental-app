import * as uuid from 'uuid';
import { UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { FOLDERS } from './cloudinary/constants';
import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';

export class FileSystemService {
  public async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    const _id = uuid.v4();
    const _transformation = {
      width: 400,
      height: 400,
      dpr: 'auto',
      crop: 'fit',
    };
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          format: 'jpg',
          folder: folder,
          public_id: _id,
          transformation: _transformation,
        },
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        },
      );

      createReadStream(file.buffer).pipe(upload);
    });
  }

  public async deleteFile(id: string): Promise<boolean> {
    try {
      const result = await v2.uploader.destroy(id, (err, res) => {
        if (err) throw err;
      });
      if (result) {
        // console.log(result);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  public async deleteMultipleFile(ids: string[]): Promise<boolean> {
    try {
      const result = await v2.api.delete_resources(ids, (err, res) => {
        if (err) throw err;
      });
      if (result) {
        // console.log(result);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  public async renameFile(id: string): Promise<UploadApiResponse> {
    const newId = id.replace('temp', 'products');

    try {
      const result = await v2.uploader.rename(id, newId, (err, res) => {
        if (err) {
          console.log(err);

          throw err;
        }
      });
      if (result) {
        // console.log(result);
        return result;
      }
      throw new HttpException('File not moved.', HttpStatus.BAD_REQUEST);
    } catch (e) {
      console.log(e);
    }
  }

  async getFilePublicId(url: string): Promise<string> {
    let folder: string;

    if (url.includes(FOLDERS.USERS)) {
      folder = FOLDERS.USERS;
    } else if (url.includes(FOLDERS.PRODUCTS)) {
      folder = FOLDERS.PRODUCTS;
    } else if (url.includes(FOLDERS.TEMP)) {
      folder = FOLDERS.TEMP;
    }
    return `${folder}/` + url.split(`${folder}/`)[1].split('.')[0];
  }

  async clearTempFolderWeekly() {
    try {
      const clearTemp = await v2.api.delete_resources_by_prefix(
        'temp',
        (err, res) => {
          if (err) {
            console.log(err);
            throw err;
          }
        },
      );

      if (clearTemp) {
        console.log(clearTemp);
        return clearTemp;
      }
      return 'Clearing temp folder failed!!!';
    } catch (e) {
      console.log(e);
    }
  }
}

// https://res.cloudinary.com/sem-cloud/image/upload/v1653228715/users/a6922960-ecc3-4339-8835-f0e17735d909.jpg
