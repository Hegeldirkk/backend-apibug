import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hacker } from './hacker.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class HackerService {
  constructor(
    @InjectRepository(Hacker)
    private hackerRepo: Repository<Hacker>,

    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getProfile(id: string): Promise<any> {
    const hacker = await this.userRepo.findOne({
      where: { id },
      relations: ['hacker'],
    });

    if (!hacker) {
      throw new NotFoundException('Hacker non trouvé');
    }

    return {
      success: true,
      message: 'Profil hacker récupéré avec succès',
      data: hacker,
    };
  }

  async updateProfile(id: string, dto: Partial<Hacker>): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['hacker'] });
  
    if (!user) {
      throw new NotFoundException('Hacker non trouvé');
    }
  
    console.log(user);  // Vérifie si l'objet hacker est correctement récupéré

    // On met à jour directement l'objet hacker
    user.hacker.nom = dto.nom || user.hacker.nom;
    user.hacker.prenom = dto.prenom || user.hacker.prenom;
    user.hacker.contact = dto.contact || user.hacker.contact;
    user.hacker.pseudo = dto.pseudo || user.hacker.pseudo;
    user.hacker.sexe = dto.sexe || user.hacker.sexe;
    user.hacker.adresse = dto.adresse || user.hacker.adresse;
    user.hacker.dateNaissance = dto.dateNaissance || user.hacker.dateNaissance;
    user.hacker.siteWeb = dto.siteWeb || user.hacker.siteWeb;
    user.hacker.aPropos = dto.aPropos || user.hacker.aPropos;
    user.hacker.niveau = dto.niveau || user.hacker.niveau;
    user.hacker.reseauxSociaux = dto.reseauxSociaux || user.hacker.reseauxSociaux;
    user.hacker.publique = dto.publique !== undefined ? dto.publique : user.hacker.publique;
  
    // Sauvegarde de l'objet hacker mis à jour
    const response = await this.hackerRepo.save(user.hacker);

    console.log(response);  // Vérifie si l'objet hacker est correctement mis à jour
  
    return {
      success: true,
      message: 'Profil hacker mis à jour avec succès',
      data: response,
    };
  }


  async getAllHackers(): Promise<any> {
    const response = await this.hackerRepo.find({ relations: ['user'] });
    return {
      success: true,
      message: 'Liste des hackers récupérée avec succès',
      data: response,
    }
  }

  async getPublicHackers(): Promise<any> {
    const response = await this.hackerRepo.find({
      where: { publique: true },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return {
      success: true,
      message: 'Liste des hackers publics récupérée avec succès',
      data: response,
    }
  }

  async getPrivateHackers(): Promise<any> {
    const response = await this.hackerRepo.find({
      where: { publique: false },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return {
      success: true,
      message: 'Liste des hackers privés récupérée avec succès',
      data: response,
    }
  }

  async getHackerRanking(): Promise<any> {
    const response = await this.hackerRepo.find({
      order: { points: 'DESC' },
      relations: ['user'],
    });
    return  {
      success: true,
      message: 'Classement des hackers récupéré avec succès',
      data: response,
    }
  }
  
}
