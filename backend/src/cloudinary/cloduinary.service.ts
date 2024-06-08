// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
  async deleteImage(publicId: string): Promise<UploadApiResponse | void> {
    return cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary deletion error:', error);
        throw new Error('Failed to delete image from Cloudinary');
      }
      return result;
    });
  }
}
