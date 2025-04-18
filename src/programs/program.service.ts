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

@Injectable()
export class ProgramService {
      
  
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    private readonly uploadService: UploadService,
  ) {}

  async createProgram(req, dto: CreateProgramDto) {
    const user = req.user;
    const company = await this.companyRepo.findOne({
      where: { user: {id: user.id} },
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
      markdown: markdownUrl,
      company: company,
    });

    const savedProgram = await this.programRepo.save(program);

    return {
      success: true,
      message: 'Programme créé avec succès',
      data: savedProgram,
    }
  }
}
