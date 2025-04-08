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
exports.SendSmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let SendSmsService = class SendSmsService {
    configService;
    apiUrl;
    apiToken;
    apiUsername;
    sender;
    constructor(configService) {
        this.configService = configService;
        this.apiUrl = this.configService.get('SMS_API_URL', 'https://default-api-url.com');
        this.apiToken = this.configService.get('SMS_API_TOKEN', 'default-token');
        this.apiUsername = this.configService.get('SMS_API_USERNAME', 'default-username');
        this.sender = this.configService.get('SMS_API_SENDER', 'default-sender');
    }
    async sendSms(to, message) {
        try {
            const response = await axios_1.default.post(this.apiUrl, {
                username: this.apiUsername,
                token: this.apiToken,
                sender: this.sender,
                recipient: to,
                message: message,
            });
            if (response.data && response.data.status === 'success') {
                console.log('SMS envoyé avec succès');
                return true;
            }
            else {
                console.error('Erreur lors de l\'envoi du SMS:', response.data);
                return false;
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi du SMS:', error);
            return false;
        }
    }
};
exports.SendSmsService = SendSmsService;
exports.SendSmsService = SendSmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendSmsService);
//# sourceMappingURL=send-sms.service.js.map