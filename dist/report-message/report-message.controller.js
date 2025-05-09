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
exports.ReportMessageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const report_message_service_1 = require("./report-message.service");
const create_report_message_dto_1 = require("./dto/create-report-message.dto");
const mark_as_read_dto_1 = require("./dto/mark-as-read.dto");
let ReportMessageController = class ReportMessageController {
    service;
    constructor(service) {
        this.service = service;
    }
    async sendMessage(req, files, dto) {
        const role = req.user.role;
        return this.service.createMessage(req, { ...dto }, files, {
            senderType: role,
            senderId: req.user.id,
        });
    }
    async markAsRead(dto, req) {
        return this.service.markAsRead(dto.messageId, req.user.role);
    }
    async getMessages(reportId) {
        return this.service.getMessagesForReport(reportId);
    }
};
exports.ReportMessageController = ReportMessageController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'files', maxCount: 5 }])),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_report_message_dto_1.CreateReportMessageDto]),
    __metadata("design:returntype", Promise)
], ReportMessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('read'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkMessageAsReadDto, Object]),
    __metadata("design:returntype", Promise)
], ReportMessageController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('report/:reportId'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportMessageController.prototype, "getMessages", null);
exports.ReportMessageController = ReportMessageController = __decorate([
    (0, common_1.Controller)('report-messages'),
    __metadata("design:paramtypes", [report_message_service_1.ReportMessageService])
], ReportMessageController);
//# sourceMappingURL=report-message.controller.js.map