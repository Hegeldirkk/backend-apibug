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
exports.Program = exports.ProgramStatus = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../company/company.entity");
const report_entity_1 = require("../report/report.entity");
var ProgramStatus;
(function (ProgramStatus) {
    ProgramStatus["NOUVEAU"] = "nouveau";
    ProgramStatus["ACTIF"] = "actif";
    ProgramStatus["FERME"] = "ferme";
    ProgramStatus["MODIFIED"] = "modified";
})(ProgramStatus || (exports.ProgramStatus = ProgramStatus = {}));
let Program = class Program {
    id;
    titre;
    description;
    prix_bas;
    prix_moyen;
    prix_eleve;
    prix_critique;
    inscope;
    outscope;
    company;
    reports;
    markdown;
    statut;
    createdAt;
    updatedAt;
};
exports.Program = Program;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Program.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Program.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "prix_bas", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "prix_moyen", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "prix_eleve", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "prix_critique", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Program.prototype, "inscope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Program.prototype, "outscope", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, (company) => company.programs, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", company_entity_1.Company)
], Program.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.program),
    __metadata("design:type", Array)
], Program.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "markdown", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProgramStatus,
        default: ProgramStatus.NOUVEAU,
    }),
    __metadata("design:type", String)
], Program.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Program.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Program.prototype, "updatedAt", void 0);
exports.Program = Program = __decorate([
    (0, typeorm_1.Entity)('programs')
], Program);
//# sourceMappingURL=program.entity.js.map