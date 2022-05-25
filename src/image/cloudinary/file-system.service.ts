import * as uuid from 'uuid';
import { UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { retry } from 'rxjs';
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
        console.log(result);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }
}

// https://res.cloudinary.com/sem-cloud/image/upload/v1653228715/users/a6922960-ecc3-4339-8835-f0e17735d909.jpg
