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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("./admin.entity");
const user_entity_1 = require("../user/user.entity");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
const program_entity_1 = require("../programs/program.entity");
const dayjs = require("dayjs");
const response_transformer_service_1 = require("../common/services/response-transformer.service");
let AdminService = class AdminService {
    adminRepo;
    userRepo;
    hackerRepo;
    companyRepo;
    programRepo;
    responseTransformer;
    constructor(adminRepo, userRepo, hackerRepo, companyRepo, programRepo, responseTransformer) {
        this.adminRepo = adminRepo;
        this.userRepo = userRepo;
        this.hackerRepo = hackerRepo;
        this.companyRepo = companyRepo;
        this.programRepo = programRepo;
        this.responseTransformer = responseTransformer;
    }
    async getProfile(userId) {
        const admin = await this.adminRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!admin) {
            throw new common_1.NotFoundException('Admin non trouvé');
        }
        return admin;
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['admin'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Admin non trouvé');
        }
        user.admin.nom = dto.nom ?? user.admin.nom;
        user.admin.prenom = dto.prenom ?? user.admin.prenom;
        user.admin.contact = dto.contact ?? user.admin.contact;
        const response = await this.adminRepo.save(user.admin);
        return {
            success: true,
            message: 'Profil mis à jour avec succès',
            data: response,
        };
    }
    async getStats(userId) {
        const now = dayjs();
        const startOfThisMonth = now.startOf('month').toDate();
        const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
        const endOfLastMonth = now.startOf('month').toDate();
        const totalHackers = await this.hackerRepo.count();
        const hackersThisMonth = await this.hackerRepo.count({
            where: {
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} >= :start`, {
                    start: startOfThisMonth,
                }),
            },
        });
        const hackersLastMonth = await this.hackerRepo.count({
            where: {
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} BETWEEN :start AND :end`, {
                    start: startOfLastMonth,
                    end: endOfLastMonth,
                }),
            },
        });
        const hackerGrowth = hackersLastMonth === 0
            ? hackersThisMonth > 0
                ? 100
                : 0
            : ((hackersThisMonth - hackersLastMonth) / hackersLastMonth) * 100;
        const totalCompanies = await this.companyRepo.count();
        const companiesThisMonth = await this.companyRepo.count({
            where: {
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} >= :start`, {
                    start: startOfThisMonth,
                }),
            },
        });
        const companiesLastMonth = await this.companyRepo.count({
            where: {
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} BETWEEN :start AND :end`, {
                    start: startOfLastMonth,
                    end: endOfLastMonth,
                }),
            },
        });
        const companyGrowth = companiesLastMonth === 0
            ? companiesThisMonth > 0
                ? 100
                : 0
            : ((companiesThisMonth - companiesLastMonth) / companiesLastMonth) *
                100;
        const totalActivePrograms = await this.programRepo.count({
            where: { statut: program_entity_1.ProgramStatus.ACTIF },
        });
        const programsThisMonth = await this.programRepo.count({
            where: {
                statut: program_entity_1.ProgramStatus.ACTIF,
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} >= :start`, {
                    start: startOfThisMonth,
                }),
            },
        });
        const programsLastMonth = await this.programRepo.count({
            where: {
                statut: program_entity_1.ProgramStatus.ACTIF,
                createdAt: (0, typeorm_2.Raw)((alias) => `${alias} BETWEEN :start AND :end`, {
                    start: startOfLastMonth,
                    end: endOfLastMonth,
                }),
            },
        });
        const programGrowth = programsLastMonth === 0
            ? programsThisMonth > 0
                ? 100
                : 0
            : ((programsThisMonth - programsLastMonth) / programsLastMonth) * 100;
        const latestHackers = await this.hackerRepo.find({
            order: { createdAt: 'DESC' },
            take: 5,
            select: ['id', 'nom', 'prenom', 'pseudo', 'points', 'createdAt'],
        });
        const latestCompanies = await this.companyRepo
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.programs', 'program')
            .leftJoinAndSelect('company.user', 'user')
            .orderBy('company.createdAt', 'DESC')
            .take(5)
            .getMany();
        const companiesWithPrograms = latestCompanies.map((company) => ({
            id: company.id,
            nom: company.nom,
            email: company.user.email,
            createdAt: company.createdAt,
            nbProgrammes: company.programs?.length || 0,
        }));
        const last6Months = Array.from({ length: 6 })
            .map((_, i) => {
            const start = dayjs().subtract(i, 'month').startOf('month');
            const end = start.endOf('month');
            return {
                label: start.format('MMMM YYYY'),
                start: start.toDate(),
                end: end.toDate(),
            };
        })
            .reverse();
        const [hackerCounts, companyCounts] = await Promise.all([
            Promise.all(last6Months.map(({ start, end }) => this.hackerRepo.count({
                where: {
                    createdAt: (0, typeorm_2.Raw)((alias) => `${alias} BETWEEN :start AND :end`, {
                        start,
                        end,
                    }),
                },
            }))),
            Promise.all(last6Months.map(({ start, end }) => this.companyRepo.count({
                where: {
                    createdAt: (0, typeorm_2.Raw)((alias) => `${alias} BETWEEN :start AND :end`, {
                        start,
                        end,
                    }),
                },
            }))),
        ]);
        const monthlyRegistrations = last6Months.map((month, index) => ({
            month: month.label,
            hackers: hackerCounts[index],
            companies: companyCounts[index],
        }));
        return {
            success: true,
            message: 'Statistiques récupérées avec succès',
            data: {
                hackers: {
                    total: totalHackers,
                    thisMonth: hackersThisMonth,
                    lastMonth: hackersLastMonth,
                    growth: hackerGrowth,
                    latest: latestHackers,
                },
                companies: {
                    total: totalCompanies,
                    thisMonth: companiesThisMonth,
                    lastMonth: companiesLastMonth,
                    growth: companyGrowth,
                    latest: companiesWithPrograms,
                },
                programs: {
                    totalActive: totalActivePrograms,
                    thisMonth: programsThisMonth,
                    lastMonth: programsLastMonth,
                    growth: programGrowth,
                },
                monthlyRegistrations,
            },
        };
    }
    async getCompaniesDetails() {
        const companies = await this.companyRepo
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.user', 'user')
            .leftJoinAndSelect('company.programs', 'program')
            .leftJoinAndSelect('program.reports', 'report')
            .leftJoinAndSelect('report.hacker', 'hacker')
            .getMany();
        return companies.map((company) => {
            const totalPrograms = company.programs.length;
            const activePrograms = company.programs.filter((p) => p.statut === 'actif').length;
            const hackerSet = new Set();
            let totalRecompense = 0;
            company.programs.forEach((program) => {
                if (program.prix_critique) {
                    const value = parseFloat(program.prix_critique);
                    if (!isNaN(value)) {
                        totalRecompense += value;
                    }
                }
                program.reports?.forEach((report) => {
                    if (report.hacker?.id) {
                        hackerSet.add(report.hacker.id);
                    }
                });
            });
            return {
                company: companies,
                totalPrograms,
                activePrograms,
                totalHackers: hackerSet.size,
                totalRecompense,
            };
        });
    }
    async getHackersSuccessRate() {
        const hackers = await this.hackerRepo
            .createQueryBuilder('hacker')
            .leftJoinAndSelect('hacker.reports', 'report')
            .leftJoinAndSelect('hacker.user', 'user')
            .getMany();
        return hackers.map((hacker) => {
            const totalReports = hacker.reports.length;
            const validatedReports = hacker.reports.filter((r) => r.statut === 'validé').length;
            const successRate = totalReports > 0 ? (validatedReports / totalReports) * 100 : 0;
            return {
                hackers,
                totalReports,
                successRate: parseFloat(successRate.toFixed(2)),
                points: hacker.points,
            };
        });
    }
    async getHackersRanking() {
        const hackers = await this.hackerRepo
            .createQueryBuilder('hacker')
            .leftJoinAndSelect('hacker.user', 'user')
            .orderBy('hacker.points', 'DESC')
            .getMany();
        return hackers.map((hacker, index) => ({
            rank: index + 1,
            hacker
        }));
    }
    async getProgramsWithHackerParticipation() {
        const programs = await this.programRepo
            .createQueryBuilder('program')
            .leftJoinAndSelect('program.company', 'company')
            .leftJoinAndSelect('program.reports', 'report')
            .leftJoin('report.hacker', 'hacker')
            .loadRelationCountAndMap('program.hackerCount', 'program.reports', 'report', (qb) => qb.select('COUNT(DISTINCT report.hackerId)'))
            .getMany();
        return programs.map((program) => ({
            program,
            nbHackers: new Set(program.reports.map((r) => r.hacker?.id)).size,
        }));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(hacker_entity_1.Hacker)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(4, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        response_transformer_service_1.ResponseTransformerService])
], AdminService);
//# sourceMappingURL=admin.service.js.map