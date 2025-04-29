import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Admin } from './admin.entity';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { User } from 'src/user/user.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Program, ProgramStatus } from 'src/programs/program.entity';
import * as dayjs from 'dayjs';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Hacker)
    private hackerRepo: Repository<Hacker>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(Program)
    private programRepo: Repository<Program>,

    private readonly responseTransformer: ResponseTransformerService,
  ) {}

  async getProfile(userId: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    return admin;
  }

  async updateProfile(
    userId: string,
    dto: UpdateAdminProfileDto,
  ): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['admin'],
    });

    if (!user) {
      throw new NotFoundException('Admin non trouvé');
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

  async getStats(userId: string) {
    const now = dayjs();
    const startOfThisMonth = now.startOf('month').toDate();
    const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = now.startOf('month').toDate();

    // Total Hackers & Croissance
    const totalHackers = await this.hackerRepo.count();
    const hackersThisMonth = await this.hackerRepo.count({
      where: {
        createdAt: Raw((alias) => `${alias} >= :start`, {
          start: startOfThisMonth,
        }),
      },
    });
    const hackersLastMonth = await this.hackerRepo.count({
      where: {
        createdAt: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
          start: startOfLastMonth,
          end: endOfLastMonth,
        }),
      },
    });
    const hackerGrowth =
      hackersLastMonth === 0
        ? hackersThisMonth > 0
          ? 100
          : 0
        : ((hackersThisMonth - hackersLastMonth) / hackersLastMonth) * 100;

    // Total Entreprises & Croissance
    const totalCompanies = await this.companyRepo.count();
    const companiesThisMonth = await this.companyRepo.count({
      where: {
        createdAt: Raw((alias) => `${alias} >= :start`, {
          start: startOfThisMonth,
        }),
      },
    });
    const companiesLastMonth = await this.companyRepo.count({
      where: {
        createdAt: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
          start: startOfLastMonth,
          end: endOfLastMonth,
        }),
      },
    });
    const companyGrowth =
      companiesLastMonth === 0
        ? companiesThisMonth > 0
          ? 100
          : 0
        : ((companiesThisMonth - companiesLastMonth) / companiesLastMonth) *
          100;

    // Programmes actifs
    const totalActivePrograms = await this.programRepo.count({
      where: { statut: ProgramStatus.ACTIF },
    });
    const programsThisMonth = await this.programRepo.count({
      where: {
        statut: ProgramStatus.ACTIF,
        createdAt: Raw((alias) => `${alias} >= :start`, {
          start: startOfThisMonth,
        }),
      },
    });
    const programsLastMonth = await this.programRepo.count({
      where: {
        statut: ProgramStatus.ACTIF,
        createdAt: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
          start: startOfLastMonth,
          end: endOfLastMonth,
        }),
      },
    });
    const programGrowth =
      programsLastMonth === 0
        ? programsThisMonth > 0
          ? 100
          : 0
        : ((programsThisMonth - programsLastMonth) / programsLastMonth) * 100;

    // Derniers hackers
    const latestHackers = await this.hackerRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'nom', 'prenom', 'pseudo', 'points', 'createdAt'],
    });

    // Dernières entreprises
    const latestCompanies = await this.companyRepo
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.programs', 'program')
      .leftJoinAndSelect('company.user', 'user') // 👈 JOIN de la relation user
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

    // Inscriptions sur les 6 derniers mois
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
      Promise.all(
        last6Months.map(({ start, end }) =>
          this.hackerRepo.count({
            where: {
              createdAt: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
                start,
                end,
              }),
            },
          }),
        ),
      ),
      Promise.all(
        last6Months.map(({ start, end }) =>
          this.companyRepo.count({
            where: {
              createdAt: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
                start,
                end,
              }),
            },
          }),
        ),
      ),
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

  async getCompaniesDetails(): Promise<any[]> {
    const companies = await this.companyRepo
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndSelect('company.programs', 'program')
      .leftJoinAndSelect('program.reports', 'report')
      .leftJoinAndSelect('report.hacker', 'hacker')
      .getMany();

    return companies.map((company) => {
      const totalPrograms = company.programs.length;
      const activePrograms = company.programs.filter(
        (p) => p.statut === 'actif',
      ).length;

      const hackerSet = new Set<string>();
      let totalRecompense = 0;

      company.programs.forEach((program) => {
        // Récompense estimée basée sur le prix_critique du programme
        if (program.prix_critique) {
          const value = parseFloat(program.prix_critique);
          if (!isNaN(value)) {
            totalRecompense += value;
          }
        }

        // Ajout des hackers qui ont soumis un rapport
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

  async getHackersSuccessRate(): Promise<any[]> {
    const hackers = await this.hackerRepo
      .createQueryBuilder('hacker')
      .leftJoinAndSelect('hacker.reports', 'report')
      .leftJoinAndSelect('hacker.user', 'user')
      .getMany();

    return hackers.map((hacker) => {
      const totalReports = hacker.reports.length;
      const validatedReports = hacker.reports.filter(
        (r) => r.statut === 'validé',
      ).length;
      const successRate =
        totalReports > 0 ? (validatedReports / totalReports) * 100 : 0;

      return {
        hackers,
        totalReports,
        successRate: parseFloat(successRate.toFixed(2)),
        points: hacker.points,
      };
    });
  }

  async getHackersRanking(): Promise<any[]> {
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
      .loadRelationCountAndMap('program.hackerCount', 'program.reports', 'report', (qb) =>
        qb.select('COUNT(DISTINCT report.hackerId)')
      )
      .getMany();
  
    return programs.map((program) => ({
      program,
      nbHackers: new Set(program.reports.map((r) => r.hacker?.id)).size, // Hackers uniques
    }));
  }
  
}
