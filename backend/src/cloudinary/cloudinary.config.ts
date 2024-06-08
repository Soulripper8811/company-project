// src/cloudinary/cloudinary.config.ts
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
    destination: './uploads',
  }),
};
