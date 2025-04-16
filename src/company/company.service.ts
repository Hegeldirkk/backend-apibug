import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { url } from 'inspector';

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface FileUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

// Constantes pour la validation des fichiers
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
};

// Définir les chemins de base pour les uploads
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const PARTNER_DOCS_DIR = path.join(UPLOAD_DIR, 'identity');
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    //private fileUploadService: FileUploadService
  ) {
    // Créer les dossiers de base au démarrage du service
    this.initializeUploadDirectories();
  }

  // Méthode pour initialiser les dossiers d'upload
  private async initializeUploadDirectories() {
    try {
      await this.ensureDirectoryExists(UPLOAD_DIR);
      await this.ensureDirectoryExists(PARTNER_DOCS_DIR);
      console.log("Dossiers d'upload initialisés avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation des dossiers d'upload:",
        error,
      );
    }
  }

  // Méthodes utilitaires pour la gestion des fichiers
  private validateFile(file: Express.Multer.File): FileValidationResult {
    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Le fichier ${file.originalname} dépasse la taille maximale autorisée (5MB)`,
      };
    }

    // Vérifier le type MIME
    const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedExtensions) {
      return {
        isValid: false,
        error: `Le type de fichier ${file.mimetype} n'est pas autorisé`,
      };
    }

    // Vérifier l'extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `L'extension ${fileExtension} n'est pas autorisée pour ce type de fichier`,
      };
    }

    return { isValid: true };
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const uniqueId = uuidv4();
    return `${uniqueId}${extension}`;
  }

  private async saveFile(
    file: Express.Multer.File,
    targetDir: string,
  ): Promise<FileUploadResult> {
    try {
      // Valider le fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Créer le dossier si nécessaire
      await this.ensureDirectoryExists(targetDir);

      // Générer un nom de fichier unique
      const uniqueFileName = this.generateUniqueFileName(file.originalname);
      const filePath = path.join(targetDir, uniqueFileName);

      // Sauvegarder le fichier
      await fs.promises.writeFile(filePath, file.buffer);

      return {
        success: true,
        filePath: path.relative(UPLOAD_DIR, filePath),
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la sauvegarde du fichier: ${error.message}`,
      };
    }
  }

  create(data: CreateCompanyDto) {
    const company = this.companyRepo.create(data);
    return this.companyRepo.save(company);
  }

  findAll() {
    return this.companyRepo.find();
  }

  async findOne(id: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Société non trouvée');
    return company;
  }

  async update(id: string, data: UpdateCompanyDto) {
    await this.findOne(id); // Vérifie que la company existe
    await this.companyRepo.update(id, data);
    return this.findOne(id);
  }

  async updateCompanyInfo(
    req,
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
      const savedFiles = await this.saveFiles(files, req);
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
        company.logo = savedFiles.logo;
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
      if (dto.pays) company.pays = dto.pays;
      company.user.docSet = true; // Mettre à jour le statut du document de l'utilisateur

      await this.companyRepo.save(company);

      return {
        error: false,
        message: 'Entreprise mise à jour avec succès',
        data: {
          company: {
            id: company.id,
            nom: company.nom,
            description: company.description,
            type_entreprise: company.type_entreprise,
            email_company: company.email_company,
            language: company.language,
            secteur: company.secteur,
            statut_actuel: company.statut_actuel,
            verfied: company.verified,
            registre_commerce: company.registre_commerce,
            logo: company.logo,
            responsable_nom_complet: company.responsable_nom_complet,
            responsable_contact: company.responsable_contact,
            fix: company.fix,
            email: company.email,
            adresse: company.adresse,
            urlSite: company.urlSite,
            num_identification: company.num_identification,
          },
          user: {
            id: company.user.id,
            email: company.user.email,
            numeroTelephone: company.user.numeroTelephone,
            role: company.user.role,
            statutCompte: company.user.statutCompte,
            verified: company.user.verified,
            docSet: company.user.docSet,
          },
        },
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

  async remove(id: string) {
    const company = await this.findOne(id);
    return this.companyRepo.remove(company);
  }

  // Méthode pour enregistrer les fichiers dans un répertoire
  private async saveFiles(
    files: {
      registre_commerce?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
    req,
  ) {
    const savedFiles: {
      registre_commerce: string;
      logo: string;
    } = {
      registre_commerce: '',
      logo: '',
    };

    const userId = req.user.id;
    const userDir = path.join(PARTNER_DOCS_DIR, `user_${userId}`);

    try {
      // Sauvegarder registre de commerce
      if (files.registre_commerce && files.registre_commerce.length > 0) {
        const result = await this.saveFile(files.registre_commerce[0], userDir);
        if (!result.success || !result.filePath) {
          throw new Error(result.error);
        }
        savedFiles.registre_commerce = result.filePath;
      }

      // Sauvegarder logo
      if (files.logo && files.logo.length > 0) {
        const result = await this.saveFile(files.logo[0], userDir);
        if (!result.success || !result.filePath) {
          throw new Error(result.error);
        }
        savedFiles.logo = result.filePath;
      }

      return savedFiles;
    } catch (error) {
      // En cas d'erreur, nettoyer les fichiers déjà uploadés
      await this.cleanupUploadedFiles(savedFiles);
      throw error;
    }
  }

  private async cleanupUploadedFiles(files: {
    registre_commerce: string;
    logo: string;
  }) {
    try {
      // Supprimer le registre de commerce
      if (files.registre_commerce) {
        const fullPath = path.join(UPLOAD_DIR, files.registre_commerce);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
        }
      }

      // Supprimer le registre de commerce
      if (files.logo) {
        const fullPath = path.join(UPLOAD_DIR, files.logo);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des fichiers:', error);
    }
  }
}
