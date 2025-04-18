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
const path = require("path");
const upload_service_1 = require("../common/upload/upload.service");
let CompanyService = class CompanyService {
    companyRepo;
    uploadService;
    constructor(companyRepo, uploadService) {
        this.companyRepo = companyRepo;
        this.uploadService = uploadService;
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
                avatar: company.user.avatar,
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
                document_outscope: company.responsable,
                inscope: company.outscope,
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
        if (!data) {
            throw new common_1.BadRequestException('Aucune donnée transmise pour la mise à jour.');
        }
        if (data.nom !== undefined)
            company.nom = data.nom;
        if (data.description !== undefined)
            company.description = data.description;
        if (data.type_entreprise !== undefined)
            company.type_entreprise = data.type_entreprise;
        if (data.email_company !== undefined)
            company.email_company = data.email_company;
        if (data.language !== undefined)
            company.language = data.language;
        if (data.secteur !== undefined)
            company.secteur = data.secteur;
        if (data.statut_actuel !== undefined)
            company.statut_actuel = data.statut_actuel;
        if (data.responsable_nom_complet !== undefined)
            company.responsable_nom_complet = data.responsable_nom_complet;
        if (data.responsable_contact !== undefined)
            company.responsable_contact = data.responsable_contact;
        if (data.fix !== undefined)
            company.fix = data.fix;
        if (data.adresse !== undefined)
            company.adresse = data.adresse;
        if (data.urlSite !== undefined)
            company.urlSite = data.urlSite;
        if (data.num_identification !== undefined)
            company.num_identification = data.num_identification;
        if (data.date_creation !== undefined)
            company.date_creation = data.date_creation;
        if (data.pays !== undefined)
            company.pays = data.pays;
        if (data.longitude !== undefined)
            company.longitude = data.longitude;
        if (data.latitude !== undefined)
            company.latitude = data.latitude;
        if (data.reseaux_sociaux !== undefined)
            company.reseaux_sociaux = data.reseaux_sociaux;
        if (data.horaires_ouverture !== undefined)
            company.horaires_ouverture = data.horaires_ouverture;
        if (data.langues !== undefined)
            company.langues = data.langues;
        if (data.services !== undefined)
            company.services = data.services;
        if (data.responsable !== undefined)
            company.responsable = data.responsable;
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
            const targetDir = path.join('uploads', `company_${company.id}`);
            const savedFiles = await this.uploadService.saveMultipleFiles(files, targetDir);
            console.log('✅ Fichiers sauvegardés :', savedFiles);
            if (!savedFiles.registre_commerce)
                throw new common_1.BadRequestException('document registre de commerce requis');
            if (!savedFiles.logo)
                throw new common_1.BadRequestException('logo requis');
            if (savedFiles.registre_commerce) {
                company.registre_commerce = savedFiles.registre_commerce;
            }
            if (savedFiles.logo) {
                company.user.avatar = savedFiles.logo;
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
                    avatar: company.user.avatar,
                    nom: company.nom,
                    description: company.description,
                    type_entreprise: company.type_entreprise,
                    email_company: company.email_company,
                    language: company.language,
                    secteur: company.secteur,
                    statut_actuel: company.statut_actuel,
                    verfied: company.verified,
                    registre_commerce: company.registre_commerce,
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
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService])
], CompanyService);
//# sourceMappingURL=company.service.js.map