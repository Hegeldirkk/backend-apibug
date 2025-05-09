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
exports.HackerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hacker_entity_1 = require("./hacker.entity");
const user_entity_1 = require("../user/user.entity");
const response_transformer_service_1 = require("../common/services/response-transformer.service");
let HackerService = class HackerService {
    hackerRepo;
    userRepo;
    responseTransformer;
    constructor(hackerRepo, userRepo, responseTransformer) {
        this.hackerRepo = hackerRepo;
        this.userRepo = userRepo;
        this.responseTransformer = responseTransformer;
    }
    async getProfile(id) {
        const hacker = await this.userRepo.findOne({
            where: { id },
            relations: ['hacker'],
        });
        if (!hacker) {
            throw new common_1.NotFoundException('Hacker non trouvé');
        }
        return {
            success: true,
            message: 'Profil hacker récupéré avec succès',
            data: await this.responseTransformer.transform(hacker),
        };
    }
    async updateProfile(id, dto) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['hacker'] });
        if (!user) {
            throw new common_1.NotFoundException('Hacker non trouvé');
        }
        console.log(user);
        user.hacker.nom = dto.nom || user.hacker.nom;
        user.hacker.prenom = dto.prenom || user.hacker.prenom;
        user.hacker.contact = dto.contact || user.hacker.contact;
        user.hacker.pseudo = dto.pseudo || user.hacker.pseudo;
        user.hacker.sexe = dto.sexe || user.hacker.sexe;
        user.hacker.adresse = dto.adresse || user.hacker.adresse;
        user.hacker.dateNaissance = dto.dateNaissance || user.hacker.dateNaissance;
        user.hacker.siteWeb = dto.siteWeb || user.hacker.siteWeb;
        user.hacker.aPropos = dto.aPropos || user.hacker.aPropos;
        user.hacker.niveau = dto.niveau || user.hacker.niveau;
        user.hacker.reseauxSociaux = dto.reseauxSociaux || user.hacker.reseauxSociaux;
        user.hacker.publique = dto.publique !== undefined ? dto.publique : user.hacker.publique;
        const response = await this.hackerRepo.save(user.hacker);
        console.log(response);
        return {
            success: true,
            message: 'Profil hacker mis à jour avec succès',
            data: await this.responseTransformer.transform(response),
        };
    }
    async getAllHackers() {
        const response = await this.hackerRepo.find({ relations: ['user'] });
        return {
            success: true,
            message: 'Liste des hackers récupérée avec succès',
            data: await this.responseTransformer.transform(response),
        };
    }
    async getPublicHackers() {
        const response = await this.hackerRepo.find({
            where: { publique: true },
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
        return {
            success: true,
            message: 'Liste des hackers publics récupérée avec succès',
            data: await this.responseTransformer.transform(response),
        };
    }
    async getPrivateHackers() {
        const response = await this.hackerRepo.find({
            where: { publique: false },
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
        return {
            success: true,
            message: 'Liste des hackers privés récupérée avec succès',
            data: await this.responseTransformer.transform(response),
        };
    }
    async getHackerRanking() {
        const response = await this.hackerRepo.find({
            order: { points: 'DESC' },
            relations: ['user'],
        });
        return {
            success: true,
            message: 'Classement des hackers récupéré avec succès',
            data: await this.responseTransformer.transform(response),
        };
    }
};
exports.HackerService = HackerService;
exports.HackerService = HackerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        response_transformer_service_1.ResponseTransformerService])
], HackerService);
//# sourceMappingURL=hacker.service.js.map