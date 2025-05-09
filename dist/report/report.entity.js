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
exports.Report = exports.ReportStatus = void 0;
const typeorm_1 = require("typeorm");
const hacker_entity_1 = require("../hacker/hacker.entity");
const program_entity_1 = require("../programs/program.entity");
const report_message_entity_1 = require("../report-message/report-message.entity");
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["EN_ATTENTE"] = "en_attente";
    ReportStatus["VALIDE"] = "valid\u00E9";
    ReportStatus["REJETE"] = "rejet\u00E9";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let Report = class Report {
    id;
    titre;
    description;
    preuves;
    vulnerability;
    statut;
    hacker;
    markdown;
    program;
    messages;
    createdAt;
    updatedAt;
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Report.prototype, "preuves", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Report.prototype, "vulnerability", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReportStatus,
        default: ReportStatus.EN_ATTENTE,
    }),
    __metadata("design:type", String)
], Report.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hacker_entity_1.Hacker, (hacker) => hacker.reports, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", hacker_entity_1.Hacker)
], Report.prototype, "hacker", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "markdown", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => program_entity_1.Program, (program) => program.reports, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", program_entity_1.Program)
], Report.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_message_entity_1.ReportMessage, (msg) => msg.report),
    __metadata("design:type", Array)
], Report.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)('reports')
], Report);
//# sourceMappingURL=report.entity.js.map