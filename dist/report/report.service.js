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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./report.entity");
const hacker_entity_1 = require("../hacker/hacker.entity");
const program_entity_1 = require("../programs/program.entity");
const upload_service_1 = require("../common/upload/upload.service");
const path = require("path");
const user_entity_1 = require("../user/user.entity");
let ReportService = class ReportService {
    reportRepo;
    hackerRepo;
    userRepo;
    programRepo;
    uploadService;
    constructor(reportRepo, hackerRepo, userRepo, programRepo, uploadService) {
        this.reportRepo = reportRepo;
        this.hackerRepo = hackerRepo;
        this.userRepo = userRepo;
        this.programRepo = programRepo;
        this.uploadService = uploadService;
    }
    detectFileType(url) {
        const extension = url.split('.').pop()?.toLowerCase();
        if (!extension)
            return 'autre';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension))
            return 'image';
        if (['mp4', 'avi', 'mov', 'mkv'].includes(extension))
            return 'video';
        return 'autre';
    }
    async findAll() {
        return this.reportRepo.find();
    }
    async findByProgram(programId) {
        return this.reportRepo.find({ where: { program: { id: programId } } });
    }
    async findByCompany(userId) {
        return {
            success: true,
            message: 'Liste des rapports avec programmes et hackers récupérée avec succès',
            data: await this.reportRepo.find({
                relations: ['program', 'hacker'],
                where: {
                    program: { company: { user: { id: userId } } },
                },
                order: { createdAt: 'DESC' },
            }),
        };
    }
    async findByHacker(hackerId) {
        return this.reportRepo.find({ where: { hacker: { id: hackerId } } });
    }
    async create(dto, hackerId, files) {
        const hacker = await this.userRepo.findOne({
            where: { id: hackerId },
            relations: ['hacker'],
        });
        if (!hacker)
            throw new common_1.NotFoundException('Hacker non trouvé');
        const program = await this.programRepo.findOne({
            where: { id: dto.programId },
            relations: ['company'],
        });
        if (!program)
            throw new common_1.NotFoundException('Programme non trouvé');
        const report = new report_entity_1.Report();
        if (files.preuves && Array.isArray(files.preuves)) {
            const targetDir = path.join('uploads', `company_${program.company.id}`, 'reports/preuves');
            const savedFiles = await Promise.all(files.preuves.map((file) => this.uploadService.saveFile(file, targetDir)));
            report.preuves = savedFiles
                .filter((file) => file.success && file.filePath)
                .map((file) => ({
                type: this.detectFileType(file.filePath),
                url: file.filePath,
            }));
        }
        let markdownUrl;
        if (dto.markdown) {
            const targetDir = path.join('uploads', `company_${program.company.id}`, 'programs/rapports');
            markdownUrl = await this.uploadService.saveMarkdownToJson(dto.markdown, targetDir);
        }
        report.titre = dto.titre;
        report.description = dto.description;
        report.markdown = markdownUrl;
        report.hacker = hacker.hacker;
        report.program = program;
        report.vulnerability = dto.vulnerability ?? [];
        const newReport = await this.reportRepo.save(report);
        return {
            success: true,
            message: 'Rapport créé avec succès',
            data: newReport,
        };
    }
    async updateStatus(dto, userId) {
        const report = await this.reportRepo.findOne({
            where: { id: dto.reportId },
            relations: ['program', 'program.company', 'program.company.user'],
        });
        if (!report)
            throw new common_1.NotFoundException('Rapport non trouvé');
        if (report.program.company.user.id !== userId) {
            throw new common_1.NotFoundException('Programme non trouvé pour cette entreprise');
        }
        report.statut = dto.status;
        const updatedReport = await this.reportRepo.save(report);
        return {
            success: true,
            message: 'Statut du rapport mis à jour avec succès',
            data: updatedReport,
        };
    }
    async getAllReportsWithMessages() {
        return this.reportRepo.find({
            relations: [
                'program',
                'hacker',
                'messages',
                'messages.hacker',
                'messages.company',
            ],
            order: {
                createdAt: 'DESC',
            },
        });
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(1, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService])
], ReportService);
//# sourceMappingURL=report.service.js.map