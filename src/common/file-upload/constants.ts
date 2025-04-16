import * as path from 'path';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
};

export const UPLOAD_DIR = path.join(__dirname, '../../../uploads');
export const PARTNER_DOCS_DIR = path.join(UPLOAD_DIR, 'partners');
