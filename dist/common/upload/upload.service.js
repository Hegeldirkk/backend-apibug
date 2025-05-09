"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');
const PARTNER_DOCS_DIR = path.join(UPLOAD_DIR, 'partner_docs');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'text/markdown': ['.md'],
};
let UploadService = class UploadService {
    constructor() {
        this.initializeUploadDirectories();
    }
    async initializeUploadDirectories() {
        try {
            await this.ensureDirectoryExists(UPLOAD_DIR);
            await this.ensureDirectoryExists(PARTNER_DOCS_DIR);
            console.log("✅ Dossiers d'upload initialisés avec succès");
        }
        catch (error) {
            console.error("❌ Erreur lors de l'initialisation des dossiers d'upload:", error);
        }
    }
    validateFile(file) {
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
    async ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }
    }
    generateUniqueFileName(originalName) {
        const extension = path.extname(originalName);
        return `${(0, uuid_1.v4)()}${extension}`;
    }
    async saveFile(file, targetDir) {
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
            filePath: path.relative(UPLOAD_DIR, filePath).replace(/\\/g, '/'),
        };
    }
    async saveMultipleFiles(files, targetDir) {
        const result = {};
        for (const key in files) {
            const file = files[key]?.[0];
            if (!file)
                continue;
            const saved = await this.saveFile(file, targetDir);
            if (!saved.success || !saved.filePath) {
                throw new Error(`Erreur en sauvegardant ${key}: ${saved.error}`);
            }
            result[key] = saved.filePath;
        }
        return result;
    }
    async saveMarkdownToJson(content, targetDir) {
        try {
            const fileName = `${(0, uuid_1.v4)()}.json`;
            const filePath = path.join(targetDir, fileName);
            await this.ensureDirectoryExists(targetDir);
            const jsonContent = {
                content: content.split('\n').map(line => line.trim()),
            };
            await fs.promises.writeFile(filePath, JSON.stringify(jsonContent, null, 2), 'utf8');
            return path.join(targetDir, fileName).replace(/\\/g, '/');
        }
        catch (error) {
            throw new Error(`Erreur lors de l'enregistrement du markdown : ${error.message}`);
        }
    }
    async cleanupUploadedFiles(files) {
        for (const relativePath of files) {
            const fullPath = path.join(UPLOAD_DIR, relativePath);
            if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
            }
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map