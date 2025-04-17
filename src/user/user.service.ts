import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
                logo: company.logo,
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
