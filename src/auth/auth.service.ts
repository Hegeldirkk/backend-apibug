import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatutCompte, User, UserRole } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { ConfirmationTokenService } from 'src/common/confirmation-token.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/update-password.dto';
import { access, stat } from 'fs';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Hacker)
    private readonly hackerRepo: Repository<Hacker>,

    private readonly confirmationTokenService: ConfirmationTokenService, // Injection du service de génération de lien

    private readonly responseTransformer: ResponseTransformerService,
  ) {}

  // 📩 méthode privée : envoi de lien de confirmation
  private async sendConfirmationEmail(user: User) {
    const ait = 0;
    const response =
      await this.confirmationTokenService.generateConfirmationLink(
        user.id,
        user.email,
        user.role,
        ait,
      );
    console.log('Lien de confirmation envoyé :', response);
    return response;
  }

  //creer un utilisateur de type entreprise
  async registerCompany(dto: RegisterDto) {
    const user = await this.createUserBase(dto, UserRole.ENTREPRISE);

    const newCompany = this.companyRepo.create({ user });

    const company = await this.companyRepo.save(newCompany);

    await this.sendConfirmationEmail(company.user);

    return {
      success: true,
      message: 'Entreprise créée, un mail a été envoyé',
      data: this.responseTransformer.transform(company),
    };
  }

  //creer un utilisateur de type hacker
  async registerHacker(dto: RegisterDto) {
    const user = await this.createUserBase(dto, UserRole.HACKER);

    const hacker = this.hackerRepo.create({ user });
    console.log('HACKER OBJ:', hacker); // 👀 Tu dois voir un objet ici
    await this.hackerRepo.save(hacker);

    await this.sendConfirmationEmail(user);

    return {
      success: true,
      message: 'Hacker créé, un mail a été envoyé',
      data: this.responseTransformer.transform(user),
    };
  }

  // 🔒 méthode privée : création de l’utilisateur avec hash
  private async createUserBase(
    dto: RegisterDto,
    role: UserRole,
  ): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email, verified: true },
    });

    if (existing) {
      throw new BadRequestException({
        success: false,
        message: 'Email déjà utilisé',
      });
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      role: role,
    });

    return await this.userRepo.save(user);
  }

  // 🔑 méthode de connexion
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, role: dto.role },
      relations: [dto.role], // Assurez-vous que la relation est correctement définie dans l'entité User
    });
    console.log('USER:', user); // 👀 Tu dois voir un objet ici
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      ait: 2,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'utilisateur connecté',
      access_token: token,
      data: this.responseTransformer.transform(user),
    };
  }

  // Méthode pour vérifier le lien de confirmation
  async verifyAccount(token: string) {
    try {
      console.log('Vérification du token de confirmation');

      // Vérifier et décoder le token
      const decoded: any = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      console.log(
        `Token vérifié pour l'utilisateur avec l'ID : ${decoded.userId}`,
      );

      // Trouver l'utilisateur par son userId (et non email)
      const user = await this.userRepo.findOne({
        where: { id: decoded.userId },
      });
      if (!user) {
        console.log('Utilisateur non trouvé');
        throw new BadRequestException({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      console.log(`Utilisateur trouvé : ${user.email}`);

      // Vérifier si l'utilisateur a déjà confirmé son compte
      if (user.verified) {
        console.log('Le compte a déjà été confirmé');
        throw new BadRequestException({
          success: false,
          message: 'Le compte a déjà été confirmé',
        });
      }

      // Marquer l'utilisateur comme confirmé
      user.verified = true; // Assurez-vous que 'verified' existe dans l'entité User
      if (user.role === UserRole.HACKER) {
        user.statutCompte = StatutCompte.ACTIF; // Mettre à jour le statut du compte
      }
      await this.userRepo.save(user);
      console.log(`Compte de l'utilisateur ${user.email} confirmé avec succès`);

      return {
        success: false,
        message: 'Compte confirmé avec succès',
        data: this.responseTransformer.transform(user),
      };
    } catch (error) {
      console.log(
        'Erreur lors de la vérification du lien de confirmation',
        error,
      );
      throw new BadRequestException(
        'Le lien de confirmation est invalide ou expiré',
      );
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Utilisateur introuvable');

    const passwordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!passwordValid)
      throw new BadRequestException('Ancien mot de passe incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { success: true, message: 'Mot de passe modifié avec succès' };
  }
}
