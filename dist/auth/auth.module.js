"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const company_entity_1 = require("../company/company.entity");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_module_1 = require("../company/company.module");
const common_module_1 = require("../common/common.module");
const confirmation_token_service_1 = require("../common/confirmation-token.service");
const jwt_strategy_1 = require("./jwt.strategy");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const user_module_1 = require("../user/user.module");
const admin_entity_1 = require("../admin/admin.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, company_entity_1.Company, hacker_entity_1.Hacker, admin_entity_1.Admin]),
            company_module_1.CompanyModule,
            config_1.ConfigModule.forRoot(),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'secret',
                    signOptions: { expiresIn: '7d' },
                }),
                inject: [config_1.ConfigService],
            }),
            common_module_1.CommonModule,
            user_module_1.UserModule
        ],
        providers: [
            auth_service_1.AuthService,
            confirmation_token_service_1.ConfirmationTokenService,
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_strategy_1.JwtStrategy
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [jwt_auth_guard_1.JwtAuthGuard, jwt_auth_guard_1.JwtAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map