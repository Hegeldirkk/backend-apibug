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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const register_dto_1 = require("./dto/register.dto");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
const confirmation_token_service_1 = require("../common/confirmation-token.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    configService;
    userRepo;
    jwtService;
    companyRepo;
    hackerRepo;
    confirmationTokenService;
    constructor(configService, userRepo, jwtService, companyRepo, hackerRepo, confirmationTokenService) {
        this.configService = configService;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.companyRepo = companyRepo;
        this.hackerRepo = hackerRepo;
        this.confirmationTokenService = confirmationTokenService;
    }
    async register(dto, role) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.BadRequestException({ success: false, message: 'Email déjà utilisé' });
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            email: dto.email,
            password: hashed,
            role: role,
        });
        await this.userRepo.save(user);
        if (role === 'company') {
            const company = this.companyRepo.create({ user });
            await this.companyRepo.save(company);
        }
        else if (role === 'hacker') {
            const hacker = this.hackerRepo.create({ user });
            await this.hackerRepo.save(hacker);
        }
        await this.confirmationTokenService.generateConfirmationLink(user.id, user.email);
        return {
            success: true,
            message: 'Compte créé, un mail a été envoyé',
            data: {
                id: user.id,
                email: user.email,
                verified: user.verified
            }
        };
    }
    async login(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new common_1.UnauthorizedException({ success: false, message: 'Identifiants invalides' });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        return {
            success: true,
            message: 'utilisateur connecté',
            data: {
                access_token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            }
        };
    }
    async verifyAccount(token) {
        try {
            console.log('Vérification du token de confirmation');
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            console.log(`Token vérifié pour l'utilisateur avec l'ID : ${decoded.userId}`);
            const user = await this.userRepo.findOne({ where: { id: decoded.userId } });
            if (!user) {
                console.log('Utilisateur non trouvé');
                throw new common_1.BadRequestException({ success: false, message: 'Utilisateur non trouvé' });
            }
            console.log(`Utilisateur trouvé : ${user.email}`);
            if (user.verified) {
                console.log('Le compte a déjà été confirmé');
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Le compte a déjà été confirmé'
                });
            }
            user.verified = true;
            await this.userRepo.save(user);
            console.log(`Compte de l'utilisateur ${user.email} confirmé avec succès`);
            return {
                success: false,
                message: 'Compte confirmé avec succès',
                data: {
                    access_token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                }
            };
        }
        catch (error) {
            console.log('Erreur lors de la vérification du lien de confirmation', error);
            throw new common_1.BadRequestException('Le lien de confirmation est invalide ou expiré');
        }
    }
    async changePassword(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('Utilisateur introuvable');
        const passwordValid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!passwordValid)
            throw new common_1.BadRequestException('Ancien mot de passe incorrect');
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.save(user);
        return { message: 'Mot de passe modifié avec succès' };
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "register", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(4, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        confirmation_token_service_1.ConfirmationTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map