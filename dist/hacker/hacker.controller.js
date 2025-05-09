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
exports.HackerController = void 0;
const common_1 = require("@nestjs/common");
const hacker_service_1 = require("./hacker.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const user_entity_1 = require("../user/user.entity");
let HackerController = class HackerController {
    hackerService;
    constructor(hackerService) {
        this.hackerService = hackerService;
    }
    async getMyProfile(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.HACKER && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        console.log(req.user.id);
        return this.hackerService.getProfile(req.user.id);
    }
    async updateProfile(req, dto) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.HACKER && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        const userId = req.user.id;
        return this.hackerService.updateProfile(userId, dto);
    }
    async getProfileById(id) {
        return this.hackerService.getProfile(id);
    }
    async findAll() {
        return await this.hackerService.getAllHackers();
    }
    async findPublicHackers() {
        return await this.hackerService.getPublicHackers();
    }
    async findPrivateHackers() {
        return await this.hackerService.getPrivateHackers();
    }
    async getRanking() {
        return await this.hackerService.getHackerRanking();
    }
};
exports.HackerController = HackerController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateHackerDto]),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "findPublicHackers", null);
__decorate([
    (0, common_1.Get)('private'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "findPrivateHackers", null);
__decorate([
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackerController.prototype, "getRanking", null);
exports.HackerController = HackerController = __decorate([
    (0, common_1.Controller)('hackers'),
    __metadata("design:paramtypes", [hacker_service_1.HackerService])
], HackerController);
//# sourceMappingURL=hacker.controller.js.map