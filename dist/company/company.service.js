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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./company.entity");
let CompanyService = class CompanyService {
    companyRepo;
    constructor(companyRepo) {
        this.companyRepo = companyRepo;
    }
    create(data) {
        const company = this.companyRepo.create(data);
        return this.companyRepo.save(company);
    }
    findAll() {
        return this.companyRepo.find();
    }
    async findOne(id) {
        const company = await this.companyRepo.findOne({ where: { id } });
        if (!company)
            throw new common_1.NotFoundException('Société non trouvée');
        return company;
    }
    async update(id, data) {
        await this.findOne(id);
        await this.companyRepo.update(id, data);
        return this.findOne(id);
    }
    async updateCompanyInfo(userId, dto, files) {
        const company = await this.companyRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!company) {
            return { status: 404, message: 'Entreprise non trouvée' };
        }
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) {
                company[key] = value;
            }
        });
        if (files?.logo)
            company.logo = files.logo;
        if (files?.registre_commerce)
            company.registre_commerce = files.registre_commerce;
        await this.companyRepo.save(company);
        return {
            status: 200,
            message: 'Entreprise mise à jour avec succès',
            data: company,
        };
    }
    async remove(id) {
        const company = await this.findOne(id);
        return this.companyRepo.remove(company);
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompanyService);
//# sourceMappingURL=company.service.js.map