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
const update_company_dto_1 = require("./dto/update-company.dto");
const path = require("path");
const user_entity_1 = require("../user/user.entity");
const upload_service_1 = require("../common/upload/upload.service");
const response_transformer_service_1 = require("../common/services/response-transformer.service");
const program_entity_1 = require("../programs/program.entity");
const report_entity_1 = require("../report/report.entity");
let CompanyService = class CompanyService {
    companyRepo;
    programRepo;
    reportRepo;
    userRepo;
    uploadService;
    responseTransformer;
    constructor(companyRepo, programRepo, reportRepo, userRepo, uploadService, responseTransformer) {
        this.companyRepo = companyRepo;
        this.programRepo = programRepo;
        this.reportRepo = reportRepo;
        this.userRepo = userRepo;
        this.uploadService = uploadService;
        this.responseTransformer = responseTransformer;
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
            data: this.responseTransformer.transform(company),
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
            data: this.responseTransformer.transform(updated),
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
                avatar: files.avatar?.[0]?.originalname,
            });
            console.log('💾 Début de sauvegarde des fichiers');
            const targetDir = path.join('uploads', `company_${company.id}`);
            const savedFiles = await this.uploadService.saveMultipleFiles(files, targetDir);
            console.log('✅ Fichiers sauvegardés :', savedFiles);
            if (!savedFiles.registre_commerce)
                throw new common_1.BadRequestException('document registre de commerce requis');
            if (!savedFiles.avatar)
                throw new common_1.BadRequestException('logo requis');
            if (savedFiles.registre_commerce) {
                company.registre_commerce = savedFiles.registre_commerce;
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
            const user = await this.userRepo.findOne({
                where: { id: userId },
            });
            if (!user)
                throw new common_1.NotFoundException('Utilisateur introuvable');
            user.docSet = true;
            if (savedFiles.avatar) {
                user.avatar = savedFiles.avatar;
            }
            await this.userRepo.save(user);
            const updated = await this.companyRepo.save(company);
            return {
                success: true,
                message: 'Entreprise mise à jour avec succès',
                data: this.responseTransformer.transform(updated),
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
    async getStatistics(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['company'],
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        if (!user.company)
            throw new common_1.NotFoundException('Entreprise introuvable');
        const totalActivePrograms = await this.programRepo.count({
            where: { company: { id: user.company.id }, statut: program_entity_1.ProgramStatus.ACTIF },
        });
        const pendingReports = await this.reportRepo.count({
            where: {
                program: { company: { id: user.company.id } },
                statut: report_entity_1.ReportStatus.EN_ATTENTE,
            },
        });
        const hackerCount = await this.reportRepo
            .createQueryBuilder('report')
            .innerJoin('report.program', 'program')
            .innerJoin('program.company', 'company')
            .where('company.id = :companyId', { companyId: user.company.id })
            .andWhere('report.hackerId IS NOT NULL')
            .select('COUNT(DISTINCT report.hackerId)', 'count')
            .getRawOne();
        const totalHackers = parseInt(hackerCount.count, 10);
        const vulnerabilities = await this.reportRepo.count({
            where: {
                program: {
                    company: {
                        id: user.company.id,
                    },
                },
                statut: report_entity_1.ReportStatus.VALIDE,
            },
        });
        return {
            success: true,
            message: 'Statistiques récupérées avec succès',
            data: {
                nombreProgrammesActifs: totalActivePrograms,
                nombreRapportsEnAttente: pendingReports,
                nombreHackers: totalHackers,
                nombreVulnerabilites: vulnerabilities,
            },
        };
    }
};
exports.CompanyService = CompanyService;
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyService.prototype, "updateCompanyInfo", null);
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __param(2, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService,
        response_transformer_service_1.ResponseTransformerService])
], CompanyService);
//# sourceMappingURL=company.service.js.map