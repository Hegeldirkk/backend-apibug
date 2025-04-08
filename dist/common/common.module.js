"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const send_email_service_1 = require("./send-email.service");
const config_1 = require("@nestjs/config");
const send_sms_service_1 = require("./send-sms.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const confirmation_token_service_1 = require("./confirmation-token.service");
const jwt_1 = require("@nestjs/jwt");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            config_1.ConfigModule, jwt_1.JwtModule],
        providers: [send_email_service_1.SendEmailService, send_sms_service_1.SendSmsService, confirmation_token_service_1.ConfirmationTokenService],
        exports: [send_email_service_1.SendEmailService, send_sms_service_1.SendSmsService, confirmation_token_service_1.ConfirmationTokenService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map