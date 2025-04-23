import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UploadService } from 'src/common/upload/upload.service';
import * as path from 'path';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async getProfileByRole(user: User) {
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['company', 'hacker', 'admin'], // Ajoute d'autres relations si besoin
    });

    if (!fullUser) throw new NotFoundException('Utilisateur non trouvé');

    const { id, email, role, statutCompte, createdAt, docSet } = fullUser;

    // === ENTREPRISE ===
    if (role === UserRole.ENTREPRISE) {
      const company = fullUser.company;

      return {
        role: 'company',
        data: {
          id,
          email,
          role,
          statutCompte,
          createdAt,
          docSet,
          ...(company
            ? {
                nom: company.nom,
                avatar: company.user.avatar,
                description: company.description,
                type_entreprise: company.type_entreprise,
                email_company: company.email_company,
                language: company.language,
                secteur: company.secteur,
                statut_actuel: company.statut_actuel,
                responsable_nom_complet: company.responsable_nom_complet,
                responsable_contact: company.responsable_contact,
                fix: company.fix,
                adresse: company.adresse,
                urlSite: company.urlSite,
                num_identification: company.num_identification,
                registre_commerce: company.registre_commerce,
                date_creation: company.date_creation,
                pays: company.pays,
                reseaux_sociaux: company.reseaux_sociaux,
                horaires_ouverture: company.horaires_ouverture,
                modes_paiement: company.modes_paiement,
              }
            : {}),
        },
      };
    }

    // === ADMIN / SUPERADMIN ===
    if (role === UserRole.ADMIN || role === UserRole.SUPERADMIN) {
      return {
        role,
        data: {
          id,
          email,
          role,
          statutCompte,
          createdAt,
        },
      };
    }

    // === HACKER ===
    if (role === UserRole.HACKER) {
      return {
        role: 'hacker',
        data: {
          id,
          email,
          role,
          statutCompte,
          createdAt,
        },
      };
    }

    // === UNKNOWN ROLE (fallback) ===
    return {
      role: 'unknown',
      data: {
        id,
        email,
        role,
      },
    };
  }

  async updateSelfie(
    id: string,
    files: {
      logo?: Express.Multer.File[];
    },
  ): Promise<{ success: boolean; message: string; data: User }> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (files.logo && Array.isArray(files.logo) && files.logo.length > 0) {
      const targetDir = path.join('uploads', 'users', 'avatars');

      const savedFile = await this.uploadService.saveFile(
        files.logo[0],
        targetDir,
      );

      if (!savedFile.success || !savedFile.filePath) {
        throw new InternalServerErrorException("Échec de l'upload de l'avatar");
      }

      user.avatar = savedFile.filePath;
    }

    const updatedUser = await this.userRepo.save(user);

    return {
      success: true,
      message: 'Selfie mis à jour avec succès',
      data: updatedUser,
    };
  }

  // findAll(): Promise<User[]> {
  //   return this.userRepo.find();
  // }

  // async findById(id: string): Promise<User> {
  //   const user = await this.userRepo.findOne({ where: { id } });
  //   if (!user) throw new NotFoundException('Utilisateur non trouvé');
  //   return user;
  // }

  // async findByEmail(email: string): Promise<User> {
  //   const user = await this.userRepo.findOne({ where: { email } });
  //   if (!user) throw new NotFoundException('Utilisateur non trouvé');
  //   return user;
  // }

  // async create(data: Partial<User>): Promise<User> {
  //   const user = this.userRepo.create(data);
  //   return this.userRepo.save(user);
  // }

  // async update(id: string, data: Partial<User>): Promise<User> {
  //   await this.userRepo.update(id, data);
  //   return this.findById(id);
  // }

  // async delete(id: string): Promise<void> {
  //   await this.userRepo.delete(id);
  // }
}
