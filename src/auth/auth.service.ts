import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../user/user.entity';
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
import { stat } from 'fs';

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
  ) {}

  async register(@Body() dto: RegisterDto, role: UserRole) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
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

    await this.userRepo.save(user);

    // 🔁 Création d’une entité liée selon le rôle
    if (role === 'company') {
      const company = this.companyRepo.create({ user });
      await this.companyRepo.save(company);
    } else if (role === 'hacker') {
      const hacker = this.hackerRepo.create({ user });
      await this.hackerRepo.save(hacker);
    }

    // Générer et envoyer le lien de confirmation
    await this.confirmationTokenService.generateConfirmationLink(
      user.id,
      user.email,
    );

    return {
      success: true,
      message: 'Compte créé, un mail a été envoyé',
      data: {
        id: user.id,
        email: user.email,
        verified: user.verified,
        statut: user.statutCompte,
        role: user.role,
        docSet: user.docSet,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
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
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'utilisateur connecté',
      data: {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
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
      await this.userRepo.save(user);
      console.log(`Compte de l'utilisateur ${user.email} confirmé avec succès`);

      return {
        success: false,
        message: 'Compte confirmé avec succès',
        data: {
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
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

    return { message: 'Mot de passe modifié avec succès' };
  }
}
