// multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as sharp from 'sharp';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(new Error('Only image files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
};

export const imageCompression = async (filePath: string): Promise<void> => {
  const compressedFilePath = filePath.replace(
    /(\.[\w\d_-]+)$/i,
    '_compressed$1',
  );
  await sharp(filePath)
    .resize(800) // Resize to a width of 800 pixels
    .jpeg({ quality: 80 }) // Compress to 80% quality
    .toFile(compressedFilePath);
};
