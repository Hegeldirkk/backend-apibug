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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./company.entity");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/jpg': ['.jpg'],
};
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const PARTNER_DOCS_DIR = path.join(UPLOAD_DIR, 'identity');
let CompanyService = class CompanyService {
    companyRepo;
    constructor(companyRepo) {
        this.companyRepo = companyRepo;
        this.initializeUploadDirectories();
    }
    async initializeUploadDirectories() {
        try {
            await this.ensureDirectoryExists(UPLOAD_DIR);
            await this.ensureDirectoryExists(PARTNER_DOCS_DIR);
            console.log("Dossiers d'upload initialisés avec succès");
        }
        catch (error) {
            console.error("Erreur lors de l'initialisation des dossiers d'upload:", error);
        }
    }
    validateFile(file) {
        if (file.size > MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `Le fichier ${file.originalname} dépasse la taille maximale autorisée (5MB)`,
            };
        }
        const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];
        if (!allowedExtensions) {
            return {
                isValid: false,
                error: `Le type de fichier ${file.mimetype} n'est pas autorisé`,
            };
        }
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return {
                isValid: false,
                error: `L'extension ${fileExtension} n'est pas autorisée pour ce type de fichier`,
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
        const uniqueId = (0, uuid_1.v4)();
        return `${uniqueId}${extension}`;
    }
    async saveFile(file, targetDir) {
        try {
            const validation = this.validateFile(file);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error,
                };
            }
            await this.ensureDirectoryExists(targetDir);
            const uniqueFileName = this.generateUniqueFileName(file.originalname);
            const filePath = path.join(targetDir, uniqueFileName);
            await fs.promises.writeFile(filePath, file.buffer);
            return {
                success: true,
                filePath: path.relative(UPLOAD_DIR, filePath),
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur lors de la sauvegarde du fichier: ${error.message}`,
            };
        }
    }
    async getCompanyProfile(user) {
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['user'],
        });
        if (!company)
            throw new common_1.NotFoundException('Entreprise introuvable');
        return {
            success: true,
            message: 'Profil récupéré avec succès',
            data: {
                id: company.id,
                role: company.user.role,
                statut: company.user.statutCompte,
                verified: company.user.verified,
                email: company.user.email,
                nom: company.nom,
                description: company.description,
                type_entreprise: company.type_entreprise,
                email_company: company.email_company,
                language: company.language,
                secteur: company.secteur,
                statut_actuel: company.statut_actuel,
                responsable_nom_complet: company.responsable_nom_complet,
                responsable_contact: company.responsable_contact,
                fix: company.fix,
                adresse: company.adresse,
                urlSite: company.urlSite,
                num_identification: company.num_identification,
                registre_commerce: company.registre_commerce,
                date_creation: company.date_creation,
                pays: company.pays,
                longitude: company.longitude,
                latitude: company.latitude,
                reseaux_sociaux: company.reseaux_sociaux,
                horaires_ouverture: company.horaires_ouverture,
                langues: company.langues,
                modes_paiement: company.modes_paiement,
                services: company.services,
                responsable: company.responsable,
                logo: company.logo,
                documents: company.documents,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt,
            },
        };
    }
    async updateCompanyProfile(user, data) {
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!company)
            throw new common_1.NotFoundException('Entreprise introuvable');
        Object.assign(company, data);
        const updated = await this.companyRepo.save(company);
        return {
            success: true,
            message: 'Profil mis à jour avec succès',
            data: updated,
        };
    }
    async updateCompanyInfo(req, dto, files) {
        try {
            const userId = req.user.id;
            console.log('🔍 Recherche de l’entreprise pour l’utilisateur :', userId);
            const company = await this.companyRepo.findOne({
                where: { user: { id: userId } },
                relations: ['user'],
            });
            if (!company) {
                console.warn('⚠️ Entreprise non trouvée pour l’utilisateur :', userId);
                throw new common_1.NotFoundException('Entreprise non trouvée');
            }
            console.log('🏢 Entreprise trouvée :', company);
            console.log('📂 Fichiers reçus :', {
                registre_commerce: files.registre_commerce?.[0]?.originalname,
                logo: files.logo?.[0]?.originalname,
            });
            console.log('💾 Début de sauvegarde des fichiers');
            const savedFiles = await this.saveFiles(files, req);
            console.log('✅ Fichiers sauvegardés :', savedFiles);
            if (!savedFiles.registre_commerce)
                throw new common_1.BadRequestException('document registre de commerce requis');
            if (!savedFiles.logo)
                throw new common_1.BadRequestException('logo requis');
            if (savedFiles.registre_commerce) {
                company.registre_commerce = savedFiles.registre_commerce;
            }
            if (savedFiles.logo) {
                company.logo = savedFiles.logo;
            }
            if (dto.nom)
                company.nom = dto.nom;
            if (dto.description)
                company.description = dto.description;
            if (dto.type_entreprise)
                company.type_entreprise = dto.type_entreprise;
            if (dto.email_company)
                company.email_company = dto.email_company;
            if (dto.language)
                company.language = dto.language;
            if (dto.secteur)
                company.secteur = dto.secteur;
            if (dto.statut_actuel)
                company.statut_actuel = dto.statut_actuel;
            if (dto.responsable_nom_complet)
                company.responsable_nom_complet = dto.responsable_nom_complet;
            if (dto.responsable_contact)
                company.responsable_contact = dto.responsable_contact;
            if (dto.fix)
                company.fix = dto.fix;
            if (dto.adresse)
                company.adresse = dto.adresse;
            if (dto.num_identification)
                company.num_identification = dto.num_identification;
            if (dto.date_creation)
                company.date_creation = dto.date_creation;
            company.user.docSet = true;
            await this.companyRepo.save(company);
            return {
                success: true,
                message: 'Entreprise mise à jour avec succès',
                data: {
                    id: company.user.id,
                    email: company.user.email,
                    numeroTelephone: company.user.numeroTelephone,
                    role: company.user.role,
                    statutCompte: company.user.statutCompte,
                    verified: company.user.verified,
                    docSet: company.user.docSet,
                    nom: company.nom,
                    description: company.description,
                    type_entreprise: company.type_entreprise,
                    email_company: company.email_company,
                    language: company.language,
                    secteur: company.secteur,
                    statut_actuel: company.statut_actuel,
                    verfied: company.verified,
                    registre_commerce: company.registre_commerce,
                    logo: company.logo,
                    responsable_nom_complet: company.responsable_nom_complet,
                    responsable_contact: company.responsable_contact,
                    fix: company.fix,
                    adresse: company.adresse,
                    urlSite: company.urlSite,
                    num_identification: company.num_identification,
                },
            };
        }
        catch (error) {
            console.error('❌ Erreur lors de la mise à jour de l’entreprise :', error);
            return {
                statusCode: 500,
                error: true,
                message: 'Erreur interne du serveur',
            };
        }
    }
    async saveFiles(files, req) {
        const savedFiles = {
            registre_commerce: '',
            logo: '',
        };
        const userId = req.user.id;
        const userDir = path.join(PARTNER_DOCS_DIR, `user_${userId}`);
        try {
            if (files.registre_commerce && files.registre_commerce.length > 0) {
                const result = await this.saveFile(files.registre_commerce[0], userDir);
                if (!result.success || !result.filePath) {
                    throw new Error(result.error);
                }
                savedFiles.registre_commerce = result.filePath;
            }
            if (files.logo && files.logo.length > 0) {
                const result = await this.saveFile(files.logo[0], userDir);
                if (!result.success || !result.filePath) {
                    throw new Error(result.error);
                }
                savedFiles.logo = result.filePath;
            }
            return savedFiles;
        }
        catch (error) {
            await this.cleanupUploadedFiles(savedFiles);
            throw error;
        }
    }
    async cleanupUploadedFiles(files) {
        try {
            if (files.registre_commerce) {
                const fullPath = path.join(UPLOAD_DIR, files.registre_commerce);
                if (fs.existsSync(fullPath)) {
                    await fs.promises.unlink(fullPath);
                }
            }
            if (files.logo) {
                const fullPath = path.join(UPLOAD_DIR, files.logo);
                if (fs.existsSync(fullPath)) {
                    await fs.promises.unlink(fullPath);
                }
            }
        }
        catch (error) {
            console.error('Erreur lors du nettoyage des fichiers:', error);
        }
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompanyService);
//# sourceMappingURL=company.service.js.map