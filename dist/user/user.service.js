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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const upload_service_1 = require("../common/upload/upload.service");
const path = require("path");
let UserService = class UserService {
    userRepo;
    uploadService;
    constructor(userRepo, uploadService) {
        this.userRepo = userRepo;
        this.uploadService = uploadService;
    }
    async findById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
    async getProfileByRole(user) {
        const fullUser = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['company', 'hacker', 'admin'],
        });
        if (!fullUser)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        const { id, email, role, statutCompte, createdAt, docSet } = fullUser;
        if (role === user_entity_1.UserRole.ENTREPRISE) {
            const company = fullUser.company;
            return {
                role: 'company',
                data: {
                    id,
                    email,
                    role,
                    statutCompte,
                    createdAt,
                    docSet,
                    ...(company
                        ? {
                            nom: company.nom,
                            avatar: company.user.avatar,
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
                            reseaux_sociaux: company.reseaux_sociaux,
                            horaires_ouverture: company.horaires_ouverture,
                            modes_paiement: company.modes_paiement,
                        }
                        : {}),
                },
            };
        }
        if (role === user_entity_1.UserRole.ADMIN || role === user_entity_1.UserRole.SUPERADMIN) {
            return {
                role,
                data: {
                    id,
                    email,
                    role,
                    statutCompte,
                    createdAt,
                },
            };
        }
        if (role === user_entity_1.UserRole.HACKER) {
            return {
                role: 'hacker',
                data: {
                    id,
                    email,
                    role,
                    statutCompte,
                    createdAt,
                },
            };
        }
        return {
            role: 'unknown',
            data: {
                id,
                email,
                role,
            },
        };
    }
    async updateSelfie(id, files) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        if (files.logo && Array.isArray(files.logo) && files.logo.length > 0) {
            const targetDir = path.join('uploads', 'users', 'avatars');
            const savedFile = await this.uploadService.saveFile(files.logo[0], targetDir);
            if (!savedFile.success || !savedFile.filePath) {
                throw new common_1.InternalServerErrorException("Échec de l'upload de l'avatar");
            }
            user.avatar = savedFile.filePath;
        }
        const updatedUser = await this.userRepo.save(user);
        return {
            success: true,
            message: 'Selfie mis à jour avec succès',
            data: updatedUser,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService])
], UserService);
//# sourceMappingURL=user.service.js.map