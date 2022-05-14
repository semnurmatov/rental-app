import * as uuid from 'uuid';
import { UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
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
}
