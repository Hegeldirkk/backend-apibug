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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const send_sms_service_1 = require("../common/send-sms.service");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let OtpService = class OtpService {
    sendSmsService;
    configService;
    userRepo;
    constructor(sendSmsService, configService, userRepo) {
        this.sendSmsService = sendSmsService;
        this.configService = configService;
        this.userRepo = userRepo;
    }
    generateOtp() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async saveOtp(phoneNumber, otp) {
        const otpRecord = this.userRepo.create({
            numeroTelephone: phoneNumber,
            otp_code: otp,
            otp_expire_at: new Date(Date.now() + 3 * 60000),
        });
        await this.userRepo.save(otpRecord);
    }
    async verifyOtp(numeroTelephone, otp_code) {
        const otpRecord = await this.userRepo.findOne({
            where: { numeroTelephone, otp_code },
        });
        if (!otpRecord) {
            return false;
        }
        if (otpRecord.otp_expire_at < new Date()) {
            return false;
        }
        return true;
    }
    async sendOtp(phoneNumber) {
        const otp = this.generateOtp();
        await this.saveOtp(phoneNumber, otp);
        const message = `Votre code OTP est : ${otp}. Il expire dans 3 minutes.`;
        console.log('le code otp est :', otp);
        await this.sendSmsService.sendSms(phoneNumber, message);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [send_sms_service_1.SendSmsService,
        config_1.ConfigService,
        typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map