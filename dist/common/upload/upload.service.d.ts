import { FileUploadResult, FileValidationResult } from './types/upload.types';
export declare class UploadService {
    constructor();
    initializeUploadDirectories(): Promise<void>;
    validateFile(file: Express.Multer.File): FileValidationResult;
    private ensureDirectoryExists;
    private generateUniqueFileName;
    saveFile(file: Express.Multer.File, targetDir: string): Promise<FileUploadResult>;
    saveMultipleFiles(files: {
        [key: string]: Express.Multer.File[];
    }, targetDir: string): Promise<{
        [key: string]: string;
    }>;
    saveMarkdownToJson(content: string, targetDir: string): Promise<string>;
    cleanupUploadedFiles(files: string[]): Promise<void>;
}
