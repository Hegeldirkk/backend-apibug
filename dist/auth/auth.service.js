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
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
const confirmation_token_service_1 = require("../common/confirmation-token.service");
const config_1 = require("@nestjs/config");
const response_transformer_service_1 = require("../common/services/response-transformer.service");
const register_admin_dto_1 = require("./dto/register-admin.dto");
const admin_entity_1 = require("../admin/admin.entity");
let AuthService = class AuthService {
    configService;
    userRepo;
    jwtService;
    companyRepo;
    hackerRepo;
    adminRepo;
    confirmationTokenService;
    responseTransformer;
    constructor(configService, userRepo, jwtService, companyRepo, hackerRepo, adminRepo, confirmationTokenService, responseTransformer) {
        this.configService = configService;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.companyRepo = companyRepo;
        this.hackerRepo = hackerRepo;
        this.adminRepo = adminRepo;
        this.confirmationTokenService = confirmationTokenService;
        this.responseTransformer = responseTransformer;
    }
    generateStrongPassword(length = 8) {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const special = '!@#$%^&*()_+[]{}<>?';
        const all = upper + lower + digits + special;
        let password = [
            upper[Math.floor(Math.random() * upper.length)],
            lower[Math.floor(Math.random() * lower.length)],
            digits[Math.floor(Math.random() * digits.length)],
            special[Math.floor(Math.random() * special.length)],
        ];
        while (password.length < length) {
            password.push(all[Math.floor(Math.random() * all.length)]);
        }
        return password
            .sort(() => Math.random() - 0.5)
            .join('');
    }
    async sendConfirmationEmail(user) {
        const ait = 0;
        const response = await this.confirmationTokenService.generateConfirmationLink(user.id, user.email, user.role, ait);
        return response;
    }
    async generateUniquePseudo(prenom, nom) {
        const adjectives = ['dark', 'silent', 'crazy', 'fast', 'shadow', 'cyber'];
        const nouns = ['wolf', 'ninja', 'tiger', 'ghost', 'falcon', 'sniper'];
        const base = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
        let pseudo = base;
        let suffix = Math.floor(Math.random() * 1000);
        while (await this.hackerRepo.findOne({ where: { pseudo } })) {
            suffix = Math.floor(Math.random() * 10000);
            pseudo = `${base}${suffix}`;
        }
        return pseudo;
    }
    async registerCompany(dto) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email, verified: false },
        });
        console.log('EXISTING:', existing);
        if (existing) {
            await this.sendConfirmationEmail(existing);
            return {
                success: false,
                message: 'Email déjà utilisé, un mail de confirmation a été renvoyé',
            };
        }
        const user = await this.createUserBase(dto, user_entity_1.UserRole.ENTREPRISE);
        const newCompany = this.companyRepo.create({ user });
        const company = await this.companyRepo.save(newCompany);
        user.company = company;
        await this.userRepo.save(user);
        await this.sendConfirmationEmail(company.user);
        return {
            success: true,
            message: 'Entreprise créée, un mail a été envoyé',
            data: this.responseTransformer.transform(company),
        };
    }
    async registerHacker(dto) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email, verified: false },
        });
        console.log('EXISTING:', existing);
        if (existing) {
            await this.sendConfirmationEmail(existing);
            return {
                success: false,
                message: 'Email déjà utilisé, un mail de confirmation a été renvoyé',
            };
        }
        const user = await this.createUserBase(dto, user_entity_1.UserRole.HACKER);
        const hacker = this.hackerRepo.create({ user });
        const newPseudo = await this.generateUniquePseudo(hacker.prenom, hacker.nom);
        hacker.pseudo = newPseudo;
        console.log('HACKER OBJ:', hacker);
        await this.hackerRepo.save(hacker);
        user.hacker = hacker;
        await this.userRepo.save(user);
        await this.sendConfirmationEmail(user);
        return {
            success: true,
            message: 'Hacker créé, un mail a été envoyé',
            data: this.responseTransformer.transform(user),
        };
    }
    async registerAdmin(req, dto, role) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException({
                success: false,
                message: 'cet admin existe déjà',
            });
        }
        const generatedPassword = this.generateStrongPassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        console.log('GENERATED PASSWORD:', generatedPassword);
        const user = this.userRepo.create({
            email: dto.email,
            password: hashedPassword,
            role,
            verified: true,
        });
        const admin = this.adminRepo.create({
            user,
            nom: dto.nom,
            contact: dto.contact,
            prenom: dto.prenom,
        });
        await this.userRepo.save(user);
        admin.user = user;
        await this.adminRepo.save(admin);
        await this.confirmationTokenService.sendAdminAccountCreatedEmail(dto.email, generatedPassword);
        return {
            success: true,
            message: 'Admin créé, un mail a été envoyé',
            data: this.responseTransformer.transform(user),
        };
    }
    async createUserBase(dto, role) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email, verified: true },
        });
        if (existing) {
            throw new common_1.BadRequestException({
                success: false,
                message: 'Email déjà utilisé',
            });
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            email: dto.email,
            password: hashed,
            role: role,
        });
        return await this.userRepo.save(user);
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email, role: dto.role },
            relations: [dto.role],
        });
        console.log('USER:', user);
        if (!user) {
            throw new common_1.BadRequestException({
                success: false,
                message: 'Identifiants invalides',
            });
        }
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new common_1.BadRequestException({
                success: false,
                message: 'Mot de passe incorrect',
            });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            ait: 2,
        };
        const token = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });
        return {
            success: true,
            message: 'utilisateur connecté',
            access_token: token,
            data: this.responseTransformer.transform(user),
        };
    }
    async loginAdmin(dto) {
        const user = await this.userRepo.findOne({
            where: [
                { email: dto.email, role: user_entity_1.UserRole.ADMIN },
                { email: dto.email, role: user_entity_1.UserRole.SUPERADMIN },
            ],
            relations: ['admin'],
        });
        console.log('USER:', user);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Identifiants invalides',
            });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            ait: 2,
        };
        const token = this.jwtService.sign(payload);
        return {
            success: true,
            message: 'utilisateur connecté',
            access_token: token,
            data: this.responseTransformer.transform(user),
        };
    }
    async verifyAccount(token) {
        try {
            console.log('Vérification du token de confirmation');
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            console.log(`Token vérifié pour l'utilisateur avec l'ID : ${decoded.userId}`);
            const user = await this.userRepo.findOne({
                where: { id: decoded.userId },
            });
            if (!user) {
                console.log('Utilisateur non trouvé');
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Utilisateur non trouvé',
                });
            }
            console.log(`Utilisateur trouvé : ${user.email}`);
            if (user.verified) {
                console.log('Le compte a déjà été confirmé');
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Le compte a déjà été confirmé',
                });
            }
            user.verified = true;
            if (user.role === user_entity_1.UserRole.HACKER) {
                user.statutCompte = user_entity_1.StatutCompte.ACTIF;
            }
            await this.userRepo.save(user);
            console.log(`Compte de l'utilisateur ${user.email} confirmé avec succès`);
            return {
                success: false,
                message: 'Compte confirmé avec succès',
                data: this.responseTransformer.transform(user),
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
        return { success: true, message: 'Mot de passe modifié avec succès' };
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_admin_dto_1.RegisterAdminDto, String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "registerAdmin", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(4, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __param(5, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        confirmation_token_service_1.ConfirmationTokenService,
        response_transformer_service_1.ResponseTransformerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map