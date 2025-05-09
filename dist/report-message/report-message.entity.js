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
exports.ReportMessage = void 0;
const typeorm_1 = require("typeorm");
const report_entity_1 = require("../report/report.entity");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
let ReportMessage = class ReportMessage {
    id;
    content;
    files;
    senderType;
    readByHacker;
    readByCompany;
    hacker;
    company;
    report;
    createdAt;
    updatedAt;
};
exports.ReportMessage = ReportMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ReportMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ReportMessage.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportMessage.prototype, "senderType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ReportMessage.prototype, "readByHacker", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ReportMessage.prototype, "readByCompany", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hacker_entity_1.Hacker, { nullable: true, eager: false }),
    __metadata("design:type", hacker_entity_1.Hacker)
], ReportMessage.prototype, "hacker", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { nullable: true, eager: false }),
    __metadata("design:type", company_entity_1.Company)
], ReportMessage.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_entity_1.Report, (report) => report.messages, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", report_entity_1.Report)
], ReportMessage.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReportMessage.prototype, "updatedAt", void 0);
exports.ReportMessage = ReportMessage = __decorate([
    (0, typeorm_1.Entity)('report_messages')
], ReportMessage);
//# sourceMappingURL=report-message.entity.js.map