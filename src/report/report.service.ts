// src/reports/report.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Program } from 'src/programs/program.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadService } from 'src/common/upload/upload.service';
import * as path from 'path';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Hacker)
    private hackerRepo: Repository<Hacker>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Program)
    private programRepo: Repository<Program>,

    private readonly uploadService: UploadService,
  ) {}

  private detectFileType(url: string): 'image' | 'video' | 'autre' {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return 'autre';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension))
      return 'image';
    if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) return 'video';

    return 'autre';
  }

  // Récupérer tous les rapports
  async findAll() {
    return this.reportRepo.find();
  }

  // Récupérer les rapports par programme
  async findByProgram(programId: string) {
    return this.reportRepo.find({ where: { program: { id: programId } } });
  }

  // Récupérer les rapports par entreprise (company)
  async findByCompany(userId: string) {
    return {
      success: true,
      message:
        'Liste des rapports avec programmes et hackers récupérée avec succès',
      data: await this.reportRepo.find({
        relations: ['program', 'hacker'],
        where: {
          program: { company: { user: { id: userId } } },
        },
        order: { createdAt: 'DESC' },
      }),
    };
  }

  // Récupérer les rapports par hacker
  async findByHacker(hackerId: string) {
    return this.reportRepo.find({ where: { hacker: { id: hackerId } } });
  }
  async create(
    dto: CreateReportDto,
    hackerId: string,
    files: {
      preuves?: Express.Multer.File[];
    },
  ): Promise<any> {
    const hacker = await this.userRepo.findOne({
      where: { id: hackerId },
      relations: ['hacker'],
    });

    if (!hacker) throw new NotFoundException('Hacker non trouvé');

    const program = await this.programRepo.findOne({
      where: { id: dto.programId },
      relations: ['company'],
    });
    if (!program) throw new NotFoundException('Programme non trouvé');

    const report = new Report();

    //sauvegarde des preuves
    if (files.preuves && Array.isArray(files.preuves)) {
      const targetDir = path.join(
        'uploads',
        `company_${program.company.id}`,
        'reports/preuves',
      );

      const savedFiles = await Promise.all(
        files.preuves.map((file) =>
          this.uploadService.saveFile(file, targetDir),
        ),
      );

      report.preuves = savedFiles
        .filter((file) => file.success && file.filePath)
        .map((file) => ({
          type: this.detectFileType(file.filePath!),
          url: file.filePath!,
        }));
    }

    let markdownUrl: string | undefined;

    if (dto.markdown) {
      const targetDir = path.join(
        'uploads',
        `company_${program.company.id}`,
        'programs/rapports',
      );
      markdownUrl = await this.uploadService.saveMarkdownToJson(
        dto.markdown,
        targetDir,
      );
    }

    report.titre = dto.titre;
    report.description = dto.description;
    report.markdown = markdownUrl;
    report.hacker = hacker.hacker;
    report.program = program;

    // Champs optionnels avec fallback
    report.vulnerability = dto.vulnerability ?? [];

    const newReport = await this.reportRepo.save(report);
    return {
      success: true,
      message: 'Rapport créé avec succès',
      data: newReport,
    };
  }

  async updateStatus(dto: UpdateReportStatusDto, userId: string): Promise<any> {
    const report = await this.reportRepo.findOne({
      where: { id: dto.reportId },
      relations: ['program', 'program.company', 'program.company.user'], // ✅ ceci fonctionne
    });

    if (!report) throw new NotFoundException('Rapport non trouvé');

    if (report.program.company.user.id !== userId) {
      throw new NotFoundException('Programme non trouvé pour cette entreprise');
    }

    report.statut = dto.status;
    const updatedReport = await this.reportRepo.save(report);
    return {
      success: true,
      message: 'Statut du rapport mis à jour avec succès',
      data: updatedReport,
    };
  }

  async getAllReportsWithMessages() {
    return this.reportRepo.find({
      relations: [
        'program',
        'hacker',
        'messages',
        'messages.hacker',
        'messages.company',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
