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
      .leftJoinAndSelect('company.programs', 'program', )
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
    };
  }
}
