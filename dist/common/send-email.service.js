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
exports.SendEmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let SendEmailService = class SendEmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: this.configService.get('SMTP_SECURE'),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendEmail(to, subject, text) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get('SMTP_USER'),
                to: to,
                subject: subject,
                text: text,
            });
            console.log('Message sent: %s', info.messageId);
            return true;
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            return false;
        }
    }
};
exports.SendEmailService = SendEmailService;
exports.SendEmailService = SendEmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendEmailService);
//# sourceMappingURL=send-email.service.js.map