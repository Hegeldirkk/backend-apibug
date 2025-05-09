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
exports.ProgramService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const program_entity_1 = require("./program.entity");
const company_entity_1 = require("../company/company.entity");
const path = require("path");
const upload_service_1 = require("../common/upload/upload.service");
const response_transformer_service_1 = require("../common/services/response-transformer.service");
const user_entity_1 = require("../user/user.entity");
const typeorm_3 = require("typeorm");
const report_entity_1 = require("../report/report.entity");
let ProgramService = class ProgramService {
    programRepo;
    companyRepo;
    userRepo;
    reportRepo;
    uploadService;
    responseTransformer;
    dataSource;
    constructor(programRepo, companyRepo, userRepo, reportRepo, uploadService, responseTransformer, dataSource) {
        this.programRepo = programRepo;
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
        this.reportRepo = reportRepo;
        this.uploadService = uploadService;
        this.responseTransformer = responseTransformer;
        this.dataSource = dataSource;
    }
    async getProgramsWithReportsAndHackers(req) {
        const user = await this.userRepo.findOne({
            where: { id: req.user.id },
            relations: ['company'],
        });
        if (!user || !user.company) {
            throw new common_1.NotFoundException("Entreprise non trouvée pour cet utilisateur");
        }
        const programs = await this.programRepo.find({
            where: {
                company: { id: user.company.id },
            },
            relations: [
                'reports',
                'reports.hacker',
                'reports.hacker.user',
            ],
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            message: 'Liste des programmes avec rapports et hackers récupérée avec succès',
            data: programs,
        };
    }
    async getHackersForEntreprisePrograms(req) {
        const user = await this.userRepo.findOne({
            where: { id: req.user.id },
            relations: ['company'],
        });
        console.log(user, 'user');
        if (!user?.company?.id) {
            throw new common_1.NotFoundException("Entreprise non trouvée pour cet utilisateur");
        }
        const reports = await this.reportRepo
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.hacker', 'hacker')
            .leftJoinAndSelect('hacker.user', 'user')
            .leftJoin('report.program', 'program')
            .leftJoin('program.company', 'company')
            .where('company.id = :companyId', { companyId: user.company.id })
            .getMany();
        const uniqueHackersMap = new Map();
        for (const report of reports) {
            if (report['hacker']) {
                uniqueHackersMap.set(report['hacker'].id, report['hacker']);
            }
        }
        const uniqueHackers = Array.from(uniqueHackersMap.values());
        return {
            success: true,
            message: 'Liste des hackers ayant participé à un programme récupérée avec succès',
            data: uniqueHackers,
        };
    }
    async getProgramsByCompany(req) {
        const user = req.user;
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!company) {
            throw new common_1.NotFoundException('Aucune entreprise trouvée pour cet utilisateur');
        }
        const programs = await this.programRepo.find({
            where: { company: { id: company.id } },
            relations: ['company', 'company.user', 'reports'],
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            message: 'Programmes récupérés avec succès',
            data: this.responseTransformer.transform(programs),
        };
    }
    async getAllProgramss(req) {
        const programes = await this.programRepo.find({
            relations: ['company', 'company.user'],
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            message: 'Tous les programmes récupérés avec succès',
            data: programes,
        };
    }
    async getAllPrograms(req) {
        const programs = await this.programRepo.find({
            relations: ['company', 'company.user', 'reports', 'reports.hacker', 'reports.hacker.user'],
            order: { createdAt: 'DESC' },
        });
        const stats = await this.dataSource.query(`
      SELECT 
        p.id AS programId,
        COUNT(r.id) AS totalRapports,
        COUNT(DISTINCT r.hackerId) AS totalHackers,
        COALESCE(SUM(JSON_LENGTH(r.vulnerability)), 0) AS totalVulnerabilites
      FROM programs p
      LEFT JOIN reports r ON r.programId = p.id
      GROUP BY p.id
    `);
        const statsMap = new Map(stats.map(stat => [stat.programId, {
                programId: stat.programId,
                totalRapports: Number(stat.totalRapports),
                totalHackers: Number(stat.totalHackers),
                totalVulnerabilites: Number(stat.totalVulnerabilites),
            }]));
        const enrichedPrograms = programs.map(program => {
            const stat = statsMap.get(program.id) || {
                totalRapports: 0,
                totalHackers: 0,
                totalVulnerabilites: 0,
            };
            return {
                ...program,
                totalRapports: stat.totalRapports,
                totalHackersUniques: stat.totalHackers,
                totalVulnerabilites: stat.totalVulnerabilites,
            };
        });
        return {
            success: true,
            message: 'Tous les programmes récupérés avec succès',
            data: enrichedPrograms,
        };
    }
    async createProgram(req, dto) {
        const user = req.user;
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!company) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        let markdownUrl;
        if (dto.markdown) {
            const targetDir = path.join('uploads', `company_${company.id}`, 'programs');
            markdownUrl = await this.uploadService.saveMarkdownToJson(dto.markdown, targetDir);
        }
        const program = this.programRepo.create({
            titre: dto.titre,
            description: dto.description,
            prix_bas: dto.prix_bas,
            prix_moyen: dto.prix_moyen,
            prix_eleve: dto.prix_eleve,
            prix_critique: dto.prix_critique,
            inscope: dto.inscope,
            outscope: dto.outscope,
            markdown: markdownUrl,
            company: company,
        });
        const savedProgram = await this.programRepo.save(program);
        return {
            success: true,
            message: 'Programme créé avec succès',
            data: savedProgram,
        };
    }
    async updateProgram(req, programId, dto) {
        const user = req.user;
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!company) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        const program = await this.programRepo.findOne({
            where: { id: programId, company: { id: company.id } },
        });
        if (!program) {
            throw new common_1.NotFoundException('Programme introuvable ou non autorisé');
        }
        if (dto.markdown) {
            const targetDir = path.join('uploads', `company_${company.id}`, 'programs');
            const markdownUrl = await this.uploadService.saveMarkdownToJson(dto.markdown, targetDir);
            program.markdown = markdownUrl;
        }
        program.titre = dto.titre ?? program.titre;
        program.description = dto.description ?? program.description;
        program.prix_bas = dto.prix_bas ?? program.prix_bas;
        program.prix_moyen = dto.prix_moyen ?? program.prix_moyen;
        program.prix_eleve = dto.prix_eleve ?? program.prix_eleve;
        program.prix_critique = dto.prix_critique ?? program.prix_critique;
        program.inscope = dto.inscope ?? program.inscope;
        program.outscope = dto.outscope ?? program.outscope;
        const updated = await this.programRepo.save(program);
        return {
            success: true,
            message: 'Programme mis à jour avec succès',
            data: updated,
        };
    }
    async updateStatusProgram(req, programId, dto) {
        const user = req.user;
        const company = await this.companyRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!company) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        const program = await this.programRepo.findOne({
            where: { id: programId, company: { id: company.id } },
        });
        if (!program) {
            throw new common_1.NotFoundException('Programme introuvable ou non autorisé');
        }
        program.statut = dto.statut;
        const updated = await this.programRepo.save(program);
        return {
            success: true,
            message: 'Statut du programme mis à jour avec succès',
            data: updated,
        };
    }
};
exports.ProgramService = ProgramService;
exports.ProgramService = ProgramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService,
        response_transformer_service_1.ResponseTransformerService,
        typeorm_3.DataSource])
], ProgramService);
//# sourceMappingURL=program.service.js.map