import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const imageUploadOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req: any, file: any, callback: any) => {
    const allowedExts = /\.(jpg|jpeg|png|webp)$/i;
    const isExtAllowed = allowedExts.test(extname(file.originalname));
    const isMimeAllowed = file.mimetype.match(/^image\/(jpeg|png|webp)$/);

    if (!isExtAllowed && !isMimeAllowed) {
      return callback(
        new BadRequestException('Hanya file gambar (jpg, jpeg, png, webp) yang diperbolehkan!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};