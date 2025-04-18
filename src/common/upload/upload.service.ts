import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadResult, FileValidationResult } from './types/upload.types';

const UPLOAD_DIR = path.join(__dirname, '../../../uploads');
const PARTNER_DOCS_DIR = path.join(UPLOAD_DIR, 'partner_docs');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'text/markdown': ['.md'],
};

@Injectable()
export class UploadService {
  constructor() {
    this.initializeUploadDirectories();
  }

  async initializeUploadDirectories(): Promise<void> {
    try {
      await this.ensureDirectoryExists(UPLOAD_DIR);
      await this.ensureDirectoryExists(PARTNER_DOCS_DIR);
      console.log("✅ Dossiers d'upload initialisés avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation des dossiers d'upload:", error);
    }
  }

  validateFile(file: Express.Multer.File): FileValidationResult {
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Le fichier ${file.originalname} dépasse 5MB.`,
      };
    }

    const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedExtensions) {
      return {
        isValid: false,
        error: `Type MIME non autorisé: ${file.mimetype}`,
      };
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Extension non autorisée: ${fileExtension}`,
      };
    }

    return { isValid: true };
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    return `${uuidv4()}${extension}`;
  }

  async saveFile(file: Express.Multer.File, targetDir: string): Promise<FileUploadResult> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    await this.ensureDirectoryExists(targetDir);
    const fileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(targetDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      success: true,
      filePath: path.relative(UPLOAD_DIR, filePath).replace(/\\/g, '/'), // pour compatibilité Windows/Linux
    };
  }

  async saveMultipleFiles(
    files: { [key: string]: Express.Multer.File[] },
    targetDir: string,
  ): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};
  
    for (const key in files) {
      const file = files[key]?.[0];
      if (!file) continue;
  
      const saved = await this.saveFile(file, targetDir);
      if (!saved.success || !saved.filePath) {
        throw new Error(`Erreur en sauvegardant ${key}: ${saved.error}`);
      }
  
      result[key] = saved.filePath;
    }
  
    return result;
  }

  async saveMarkdownToJson(content: string, targetDir: string): Promise<string> {
    try {
      const fileName = `${uuidv4()}.json`;
      const filePath = path.join(targetDir, fileName);
  
      // Créer le dossier si nécessaire
      await this.ensureDirectoryExists(targetDir);
  
      const jsonContent = {
        content: content.split('\n').map(line => line.trim()),
      };
  
      await fs.promises.writeFile(filePath, JSON.stringify(jsonContent, null, 2), 'utf8');
  
      // Retourne juste le chemin relatif (ou URL selon besoin)
      return path.join(targetDir, fileName).replace(/\\/g, '/'); // support cross-platform
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement du markdown : ${error.message}`);
    }
  }
    
  async cleanupUploadedFiles(files: string[]) {
    for (const relativePath of files) {
      const fullPath = path.join(UPLOAD_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    }
  }
}
