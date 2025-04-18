import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as path from 'path';
import { User } from 'src/user/user.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly uploadService: UploadService,
    private readonly responseTransformer: ResponseTransformerService,
  ) {}
  async getCompanyProfile(user: User) {
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (!company) throw new NotFoundException('Entreprise introuvable');

    return {
      success: true,
      message: 'Profil récupéré avec succès',
      data: this.responseTransformer.transform(company),
    };
  }

  async updateCompanyProfile(user: User, data: Partial<Company>) {
    const company = await this.companyRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!company) throw new NotFoundException('Entreprise introuvable');

    if (!data) {
      throw new BadRequestException(
        'Aucune donnée transmise pour la mise à jour.',
      );
    }

    // 🔧 Mise à jour champ par champ
    if (data.nom !== undefined) company.nom = data.nom;
    if (data.description !== undefined) company.description = data.description;
    if (data.type_entreprise !== undefined)
      company.type_entreprise = data.type_entreprise;
    if (data.email_company !== undefined)
      company.email_company = data.email_company;
    if (data.language !== undefined) company.language = data.language;
    if (data.secteur !== undefined) company.secteur = data.secteur;
    if (data.statut_actuel !== undefined)
      company.statut_actuel = data.statut_actuel;

    if (data.responsable_nom_complet !== undefined)
      company.responsable_nom_complet = data.responsable_nom_complet;
    if (data.responsable_contact !== undefined)
      company.responsable_contact = data.responsable_contact;
    if (data.fix !== undefined) company.fix = data.fix;
    if (data.adresse !== undefined) company.adresse = data.adresse;
    if (data.urlSite !== undefined) company.urlSite = data.urlSite;

    if (data.num_identification !== undefined)
      company.num_identification = data.num_identification;

    if (data.date_creation !== undefined)
      company.date_creation = data.date_creation;

    if (data.pays !== undefined) company.pays = data.pays;
    if (data.longitude !== undefined) company.longitude = data.longitude;
    if (data.latitude !== undefined) company.latitude = data.latitude;

    if (data.reseaux_sociaux !== undefined)
      company.reseaux_sociaux = data.reseaux_sociaux;
    if (data.horaires_ouverture !== undefined)
      company.horaires_ouverture = data.horaires_ouverture;
    if (data.langues !== undefined) company.langues = data.langues;

    if (data.services !== undefined) company.services = data.services;

    if (data.responsable !== undefined) company.responsable = data.responsable;

    const updated = await this.companyRepo.save(company);

    return {
      success: true,
      message: 'Profil mis à jour avec succès',
      data: this.responseTransformer.transform(updated),
    };
  }

  async updateCompanyInfo(
    @Request() req,
    dto: UpdateCompanyDto,
    files: {
      registre_commerce?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
    try {
      const userId = req.user.id;
      console.log('🔍 Recherche de l’entreprise pour l’utilisateur :', userId);

      const company = await this.companyRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!company) {
        console.warn('⚠️ Entreprise non trouvée pour l’utilisateur :', userId);
        throw new NotFoundException('Entreprise non trouvée');
      }

      console.log('🏢 Entreprise trouvée :', company);
      console.log('📂 Fichiers reçus :', {
        registre_commerce: files.registre_commerce?.[0]?.originalname,
        logo: files.logo?.[0]?.originalname,
      });

      // Sauvegarde des fichiers
      console.log('💾 Début de sauvegarde des fichiers');
      const targetDir = path.join('uploads', `company_${company.id}`);
      const savedFiles = await this.uploadService.saveMultipleFiles(
        files,
        targetDir,
      );
      console.log('✅ Fichiers sauvegardés :', savedFiles);

      // Vérifications fichiers obligatoires
      if (!savedFiles.registre_commerce)
        throw new BadRequestException('document registre de commerce requis');

      if (!savedFiles.logo) throw new BadRequestException('logo requis');

      // Mise à jour des fichiers si présents
      if (savedFiles.registre_commerce) {
        company.registre_commerce = savedFiles.registre_commerce;
      }

      if (savedFiles.logo) {
        company.user.avatar = savedFiles.logo;
      }

      // Mise à jour manuelle sécurisée
      if (dto.nom) company.nom = dto.nom;
      if (dto.description) company.description = dto.description;
      if (dto.type_entreprise) company.type_entreprise = dto.type_entreprise;
      if (dto.email_company) company.email_company = dto.email_company;
      if (dto.language) company.language = dto.language;
      if (dto.secteur) company.secteur = dto.secteur;
      if (dto.statut_actuel) company.statut_actuel = dto.statut_actuel;
      if (dto.responsable_nom_complet)
        company.responsable_nom_complet = dto.responsable_nom_complet;
      if (dto.responsable_contact)
        company.responsable_contact = dto.responsable_contact;
      if (dto.fix) company.fix = dto.fix;
      if (dto.adresse) company.adresse = dto.adresse;

      if (dto.num_identification)
        company.num_identification = dto.num_identification;
      if (dto.date_creation) company.date_creation = dto.date_creation;
      company.user.docSet = true; // Mettre à jour le statut du document de l'utilisateur

      const updated = await this.companyRepo.save(company);

      return {
        success: true,
        message: 'Entreprise mise à jour avec succès',
        data: this.responseTransformer.transform(updated),
      };
    } catch (error) {
      console.error(
        '❌ Erreur lors de la mise à jour de l’entreprise :',
        error,
      );
      return {
        statusCode: 500,
        error: true,
        message: 'Erreur interne du serveur',
      };
    }
  }
}
