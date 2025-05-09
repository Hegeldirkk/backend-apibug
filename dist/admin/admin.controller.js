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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const update_admin_profile_dto_1 = require("./dto/update-admin-profile.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_entity_1 = require("../user/user.entity");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getProfile(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        const admin = await this.adminService.getProfile(req.user.id);
        return {
            success: true,
            data: admin,
        };
    }
    async updateProfile(req, dto) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return await this.adminService.updateProfile(req.user.id, dto);
    }
    async getStats(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return await this.adminService.getStats(req.user.id);
    }
    async getCompaniesDetails(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return {
            success: true,
            message: 'liste des entreprises',
            data: await this.adminService.getCompaniesDetails(),
        };
    }
    async getHackersStats(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return {
            success: true,
            message: 'liste des hackers',
            data: await this.adminService.getHackersSuccessRate(),
        };
    }
    async getHackersRanking(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return {
            success: true,
            message: 'classement des hackers',
            data: await this.adminService.getHackersRanking(),
        };
    }
    async getProgramsParticipation(req) {
        const role = req.user.role;
        const ait = req.user.ait;
        if (role !== user_entity_1.UserRole.ADMIN && role !== user_entity_1.UserRole.SUPERADMIN && ait !== 2) {
            return {
                success: false,
                message: 'Access denied',
            };
        }
        return this.adminService.getProgramsWithHackerParticipation();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_admin_profile_dto_1.UpdateAdminProfileDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('companies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCompaniesDetails", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('hackers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHackersStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('classement-hackers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHackersRanking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('programs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProgramsParticipation", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map