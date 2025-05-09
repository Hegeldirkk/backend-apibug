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
exports.ProgramController = void 0;
const common_1 = require("@nestjs/common");
const program_service_1 = require("./program.service");
const create_program_dto_1 = require("./dto/create-program.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_statut_program_dto_1 = require("./dto/update-statut-program.dto");
let ProgramController = class ProgramController {
    programService;
    constructor(programService) {
        this.programService = programService;
    }
    async getProgramsByCompany(req) {
        return this.programService.getProgramsByCompany(req);
    }
    async getProgramsByHacker(req) {
        return this.programService.getProgramsWithReportsAndHackers(req);
    }
    async getAllHackerEntreprise(req) {
        return this.programService.getHackersForEntreprisePrograms(req);
    }
    async getAllPrograms(req) {
        return this.programService.getAllPrograms(req);
    }
    async addProgram(req, dto) {
        return this.programService.createProgram(req, dto);
    }
    async updateProgram(req, id, dto) {
        return this.programService.updateProgram(req, id, dto);
    }
    async updateStatutProgram(req, id, dto) {
        return this.programService.updateStatusProgram(req, id, dto);
    }
};
exports.ProgramController = ProgramController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-company'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "getProgramsByCompany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('by/hacker'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "getProgramsByHacker", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('all/hacker'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "getAllHackerEntreprise", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "getAllPrograms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "addProgram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "updateProgram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('statut/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_statut_program_dto_1.UpdateProgramStatutDto]),
    __metadata("design:returntype", Promise)
], ProgramController.prototype, "updateStatutProgram", null);
exports.ProgramController = ProgramController = __decorate([
    (0, common_1.Controller)('programs'),
    __metadata("design:paramtypes", [program_service_1.ProgramService])
], ProgramController);
//# sourceMappingURL=program.controller.js.map