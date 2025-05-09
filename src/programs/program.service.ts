import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './program.entity';
import { Company } from '../company/company.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import * as path from 'path';
import { UploadService } from 'src/common/upload/upload.service';
import { UpdateProgramStatutDto } from './dto/update-statut-program.dto';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
import { Hacker } from 'src/hacker/hacker.entity';
import { Report } from 'src/report/report.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    private readonly uploadService: UploadService,

    private readonly responseTransformer: ResponseTransformerService,
    private readonly dataSource: DataSource

  ) {}

  

  // Pour récupérer les programmes d'un hacker
  async getProgramsWithReportsAndHackers(req: any) {
    const user = await this.userRepo.findOne({
      where: { id: req.user.id },
      relations: ['company'],
    });
  
    if (!user || !user.company) {
      throw new NotFoundException("Entreprise non trouvée pour cet utilisateur");
    }
  
    const programs = await this.programRepo.find({
      where: {
        company: { id: user.company.id },
      },
      relations: [
        'reports',
        'reports.hacker',
        'reports.hacker.user',
      ],
      order: { createdAt: 'DESC' },
    });
  
    
    return {
      success: true,
      message: 'Liste des programmes avec rapports et hackers récupérée avec succès',
      data: programs,
    };
  }
  async getHackersForEntreprisePrograms(req: any) {
    const user = await this.userRepo.findOne({
      where: { id: req.user.id },
      relations: ['company'],
    });

    console.log(user, 'user');
  
    if (!user?.company?.id) {
      throw new NotFoundException("Entreprise non trouvée pour cet utilisateur");
    }
  
    const reports = await this.reportRepo
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.hacker', 'hacker')
      .leftJoinAndSelect('hacker.user', 'user')
      .leftJoin('report.program', 'program')
      .leftJoin('program.company', 'company')
      .where('company.id = :companyId', { companyId: user.company.id })
      .getMany();
  
    // Supprimer les doublons de hackers
    const uniqueHackersMap = new Map<string, Hacker>();
    for (const report of reports) {
      if (report['hacker']) {
        uniqueHackersMap.set(report['hacker'].id, report['hacker']);
      }
    }
  
    const uniqueHackers = Array.from(uniqueHackersMap.values());
  
    return {
      success: true,
      message: 'Liste des hackers ayant participé à un programme récupérée avec succès',
      data: uniqueHackers,
    };
  }
  
  
  
  
  // Pour récupérer les programmes d'une entreprise
  async getProgramsByCompany(req: any) {
    const user = req.user;
  
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
    });
  
    if (!company) {
      throw new NotFoundException(
        'Aucune entreprise trouvée pour cet utilisateur',
      );
    }
  
    const programs = await this.programRepo.find({
      where: { company: { id: company.id } },
      relations: ['company', 'company.user', 'reports'],
      order: { createdAt: 'DESC' },
    });
  
    return {
      success: true,
      message: 'Programmes récupérés avec succès',
      data: this.responseTransformer.transform(programs),
    };
  }
  

  // Pour récupérer tous les programmes
  async getAllProgramss(req: any) {
    // Tu peux ici ajouter un contrôle selon le rôle si nécessaire
    const programes = await this.programRepo.find({
      relations: ['company', 'company.user'],
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: 'Tous les programmes récupérés avec succès',
      data: programes,
    };
    
  }

  async getAllPrograms(req: any) {
    type ProgramStat = {
      programId: string;
      totalRapports: number;
      totalHackers: number;
      totalVulnerabilites: number;
    };
  
    const programs = await this.programRepo.find({
      relations: ['company', 'company.user', 'reports', 'reports.hacker', 'reports.hacker.user'],
      order: { createdAt: 'DESC' },
    });
  
    const stats: ProgramStat[] = await this.dataSource.query(`
      SELECT 
        p.id AS programId,
        COUNT(r.id) AS totalRapports,
        COUNT(DISTINCT r.hackerId) AS totalHackers,
        COALESCE(SUM(JSON_LENGTH(r.vulnerability)), 0) AS totalVulnerabilites
      FROM programs p
      LEFT JOIN reports r ON r.programId = p.id
      GROUP BY p.id
    `);
  
    const statsMap = new Map<string, ProgramStat>(
      stats.map(stat => [stat.programId, {
        programId: stat.programId,
        totalRapports: Number(stat.totalRapports),
        totalHackers: Number(stat.totalHackers),
        totalVulnerabilites: Number(stat.totalVulnerabilites),
      }])
    );
  
    const enrichedPrograms = programs.map(program => {
      const stat = statsMap.get(program.id) || {
        totalRapports: 0,
        totalHackers: 0,
        totalVulnerabilites: 0,
      };
  
      return {
        ...program,
        totalRapports: stat.totalRapports,
        totalHackersUniques: stat.totalHackers,
        totalVulnerabilites: stat.totalVulnerabilites,
      };
    });
  
    return {
      success: true,
      message: 'Tous les programmes récupérés avec succès',
      data: enrichedPrograms,
    };
  }
  
  
  
  

  async createProgram(req, dto: CreateProgramDto) {
    const user = req.user;
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    let markdownUrl: string | undefined;

    if (dto.markdown) {
      const targetDir = path.join(
        'uploads',
        `company_${company.id}`,
        'programs',
      );
      markdownUrl = await this.uploadService.saveMarkdownToJson(
        dto.markdown,
        targetDir,
      );
    }

    const program = this.programRepo.create({
      titre: dto.titre,
      description: dto.description,
      prix_bas: dto.prix_bas,
      prix_moyen: dto.prix_moyen,
      prix_eleve: dto.prix_eleve,
      prix_critique: dto.prix_critique,
      inscope: dto.inscope,
      outscope: dto.outscope,
      markdown: markdownUrl,
      company: company,
    });

    const savedProgram = await this.programRepo.save(program);

    return {
      success: true,
      message: 'Programme créé avec succès',
      data: savedProgram,
    };
  }

  async updateProgram(
    req,
    programId: string,
    dto: CreateProgramDto, // ou UpdateProgramDto si tu veux en faire un spécifique
  ): Promise<any> {
    const user = req.user;
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    const program = await this.programRepo.findOne({
      where: { id: programId, company: { id: company.id } },
    });

    if (!program) {
      throw new NotFoundException('Programme introuvable ou non autorisé');
    }

    // Si un nouveau contenu markdown est fourni
    if (dto.markdown) {
      const targetDir = path.join(
        'uploads',
        `company_${company.id}`,
        'programs',
      );
      const markdownUrl = await this.uploadService.saveMarkdownToJson(
        dto.markdown,
        targetDir,
      );
      program.markdown = markdownUrl;
    }

    // Mise à jour des autres champs
    program.titre = dto.titre ?? program.titre;
    program.description = dto.description ?? program.description;
    program.prix_bas = dto.prix_bas ?? program.prix_bas;
    program.prix_moyen = dto.prix_moyen ?? program.prix_moyen;
    program.prix_eleve = dto.prix_eleve ?? program.prix_eleve;
    program.prix_critique = dto.prix_critique ?? program.prix_critique;
    program.inscope = dto.inscope ?? program.inscope;
    program.outscope = dto.outscope ?? program.outscope;

    const updated = await this.programRepo.save(program);

    return {
      success: true,
      message: 'Programme mis à jour avec succès',
      data: updated,
    };
  }

  async updateStatusProgram(
    req,
    programId: string,
    dto: UpdateProgramStatutDto, // ou UpdateProgramDto si tu veux en faire un spécifique
  ): Promise<any> {
    const user = req.user;
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    const program = await this.programRepo.findOne({
      where: { id: programId, company: { id: company.id } },
    });

    if (!program) {
      throw new NotFoundException('Programme introuvable ou non autorisé');
    }

    // Mise à jour des autres champs
    program.statut = dto.statut;

    const updated = await this.programRepo.save(program);

    return {
      success: true,
      message: 'Statut du programme mis à jour avec succès',
      data: updated,
    };
  }
}
