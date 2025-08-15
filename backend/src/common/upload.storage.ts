import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export function createMulterStorage() {
  return diskStorage({
    destination: (req, file, cb) => {
      // prefer param id; fallback to req.user.id
      const nomineeId = (req as any).params?.id || (req as any).user?.id;
      const type = (req as any).params?.type ? (req as any).params.type.toLowerCase() : 'others';
      const dest = path.join(process.cwd(), 'uploads', type, nomineeId);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
      // For structured names, prefer fields: name/title/institutionName, else original base
      const body = req.body || {};
      const nameFromBody = body.name || body.title || body.institutionName || base;
      const sanitized = String(nameFromBody).replace(/[^\w\-_.]/g, '_').slice(0, 80);
      cb(null, `${sanitized}_${Date.now()}${ext}`);
    },
  });
}

export const uploadFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF/JPEG/PNG allowed'), false);
};
