import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './program.entity';
import { Company } from '../company/company.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from 'src/common/upload/upload.service';
import { UpdateProgramStatutDto } from './dto/update-statut-program.dto';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    private readonly uploadService: UploadService,

    private readonly responseTransformer: ResponseTransformerService,
  ) {}

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
      relations: ['company', 'company.user'],
      order: { createdAt: 'DESC' },
    });
  
    return {
      success: true,
      message: 'Programmes récupérés avec succès',
      data: this.responseTransformer.transform(programs),
    };
  }
  

  // Pour récupérer tous les programmes
  async getAllPrograms(req: any) {
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
