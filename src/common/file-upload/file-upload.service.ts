import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, UPLOAD_DIR, PARTNER_DOCS_DIR } from './constants';

@Injectable()
export class FileUploadService {
  constructor() {
    this.initializeUploadDirectories();
  }

  async saveFiles(files: Record<string, Express.Multer.File[]>, userId: string) {
    const savedFiles = {};
    const userDir = path.join(PARTNER_DOCS_DIR, `user_${userId}`);

    try {
      for (const key in files) {
        if (files[key]?.length) {
          const result = await this.saveFile(files[key][0], userDir);
          if (!result.success || !result.filePath) {
            throw new Error(result.error);
          }
          savedFiles[key] = result.filePath;
        }
      }
      return savedFiles;
    } catch (error) {
      await this.cleanupUploadedFiles(savedFiles);
      throw error;
    }
  }

  private async saveFile(file: Express.Multer.File, targetDir: string) {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    await this.ensureDirectoryExists(targetDir);
    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(targetDir, uniqueFileName);
    await fs.promises.writeFile(filePath, file.buffer);

    return { success: true, filePath: path.relative(UPLOAD_DIR, filePath) };
  }

  private async cleanupUploadedFiles(files: Record<string, string>) {
    for (const key in files) {
      const fullPath = path.join(UPLOAD_DIR, files[key]);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    }
  }

  private validateFile(file: Express.Multer.File) {
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: `Le fichier ${file.originalname} dépasse la taille autorisée` };
    }

    const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedExtensions) {
      return { isValid: false, error: `Type ${file.mimetype} non autorisé` };
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return { isValid: false, error: `Extension ${fileExtension} non autorisée` };
    }

    return { isValid: true };
  }

  private generateUniqueFileName(originalName: string) {
    const extension = path.extname(originalName);
    return `${uuidv4()}${extension}`;
  }

  private async ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  private async initializeUploadDirectories() {
    await this.ensureDirectoryExists(UPLOAD_DIR);
    await this.ensureDirectoryExists(PARTNER_DOCS_DIR);
  }
}
