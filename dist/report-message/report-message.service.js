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
exports.ReportMessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_message_entity_1 = require("./report-message.entity");
const create_report_message_dto_1 = require("./dto/create-report-message.dto");
const upload_service_1 = require("../common/upload/upload.service");
const path = require("path");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
const report_entity_1 = require("../report/report.entity");
let ReportMessageService = class ReportMessageService {
    repo;
    uploadService;
    hackerRepo;
    companyRepo;
    reportRepo;
    constructor(repo, uploadService, hackerRepo, companyRepo, reportRepo) {
        this.repo = repo;
        this.uploadService = uploadService;
        this.hackerRepo = hackerRepo;
        this.companyRepo = companyRepo;
        this.reportRepo = reportRepo;
    }
    detectFileType(filePath) {
        const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext))
            return 'image';
        if (['mp4', 'mov', 'avi', 'webm'].includes(ext))
            return 'video';
        return 'autre';
    }
    async createMessage(req, dto, files, data) {
        let uploadedFiles = [];
        if (files?.files && Array.isArray(files.files)) {
            const targetDir = path.join('uploads', `messages`, `sender_${data.senderType}_${data.senderId}`);
            const savedFiles = await Promise.all(files.files.map((file) => this.uploadService.saveFile(file, targetDir)));
            uploadedFiles = savedFiles
                .filter((file) => file.success && file.filePath)
                .map((file) => ({
                type: this.detectFileType(file.filePath),
                url: file.filePath,
            }));
        }
        const message = new report_message_entity_1.ReportMessage();
        message.content = dto.content;
        message.files = uploadedFiles;
        message.senderType = data.senderType;
        message.report = { id: dto.reportId };
        if (data.senderType === 'hacker') {
            const hacker = await this.hackerRepo.findOne({
                where: { user: { id: req.user.id } },
            });
            if (!hacker) {
                throw new common_1.NotFoundException('Hacker non trouvé pour cet utilisateur.');
            }
            message.hacker = hacker;
        }
        else if (data.senderType === 'company') {
            const company = await this.companyRepo.findOne({
                where: { user: { id: req.user.id } },
            });
            if (!company) {
                throw new common_1.NotFoundException('Entreprise non trouvée pour cet utilisateur.');
            }
            message.company = company;
        }
        const savedMessage = await this.repo.save(message);
        return {
            success: true,
            message: 'Message envoyé avec succès',
            data: savedMessage,
        };
    }
    async markAsRead(messageId, readerType) {
        const message = await this.repo.findOneByOrFail({ id: messageId });
        if (readerType === 'hacker') {
            message.readByHacker = true;
        }
        else {
            message.readByCompany = true;
        }
        return this.repo.save(message);
    }
    async getMessagesForReport(reportId) {
        console.log('Fetching messages for report:', reportId);
        const messages = await this.repo.find({
            where: { report: { id: reportId } },
            relations: ['hacker', 'company'],
            order: { createdAt: 'ASC' },
        });
        if (messages.length === 0) {
            return {
                success: true,
                message: 'Aucun message trouvé pour ce rapport',
                data: [],
            };
        }
        return {
            success: true,
            message: 'Messages récupérés avec succès',
            data: messages,
        };
    }
};
exports.ReportMessageService = ReportMessageService;
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_report_message_dto_1.CreateReportMessageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportMessageService.prototype, "createMessage", null);
exports.ReportMessageService = ReportMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_message_entity_1.ReportMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(4, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportMessageService);
//# sourceMappingURL=report-message.service.js.map