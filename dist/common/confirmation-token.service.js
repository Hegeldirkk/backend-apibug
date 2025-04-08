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
exports.ConfirmationTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const send_email_service_1 = require("../common/send-email.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ConfirmationTokenService = class ConfirmationTokenService {
    jwtService;
    sendEmailService;
    configService;
    userRepo;
    constructor(jwtService, sendEmailService, configService, userRepo) {
        this.jwtService = jwtService;
        this.sendEmailService = sendEmailService;
        this.configService = configService;
        this.userRepo = userRepo;
    }
    async generateConfirmationLink(userId, email) {
        try {
            const token = this.jwtService.sign({ userId: userId }, { secret: this.configService.get('JWT_SECRET'), expiresIn: '1h' });
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.BadRequestException('Utilisateur non trouvé');
            }
            await this.userRepo.save(user);
            const confirmationLink = `${this.configService.get('FRONTEND_URL')}/confirm?token=${token}`;
            const subject = 'Confirmez votre inscription';
            const message = `Cliquez sur le lien suivant pour valider votre inscription : <a href="${confirmationLink}">Confirmer mon inscription</a>`;
            await this.sendEmailService.sendEmail(email, subject, message);
        }
        catch (error) {
            throw new common_1.BadRequestException('Erreur lors de la génération du lien de confirmation');
        }
    }
};
exports.ConfirmationTokenService = ConfirmationTokenService;
exports.ConfirmationTokenService = ConfirmationTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        send_email_service_1.SendEmailService,
        config_1.ConfigService,
        typeorm_1.Repository])
], ConfirmationTokenService);
//# sourceMappingURL=confirmation-token.service.js.map