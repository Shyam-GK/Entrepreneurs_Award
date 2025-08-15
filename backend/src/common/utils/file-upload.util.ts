import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

/**
 * Ensures a directory exists, creating it recursively if missing.
 */
export function ensureDirSync(dirPath: string) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    throw new BadRequestException(`Failed to create directory: ${err.message}`);
  }
}

/**
 * Creates a Multer storage config for a specific type of upload.
 */
export function createMulterStorage(folderName: string) {
  return diskStorage({
    destination: (req, file, cb) => {
      const { userId } = req.params;
      if (!userId) return cb(new Error('userId param is required'), '');

      const dest = path.join(process.cwd(), 'uploads', folderName, userId);
      ensureDirSync(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const { userId } = req.params;
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${userId}_${safeName}`);
    },
  });
}

/**
 * Returns the relative unix path for database storage.
 */
export function toRelUnix(filePath: string): string {
  return filePath.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/+/, '');
}
