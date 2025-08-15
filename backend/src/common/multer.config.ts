// src/common/multer.config.ts
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

export const multerConfig = (userId: string, nomineeId: string) => {
  const uploadPath = `./uploads/${userId}/${nomineeId}`;
  
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return diskStorage({
    destination: (_, __, cb) => {
      cb(null, uploadPath);
    },
    filename: (_, file, cb) => {
      const prefix = file.fieldname.replace(/\s+/g, '_');
      cb(null, `${prefix}_${Date.now()}${extname(file.originalname)}`);
    }
  });
};
