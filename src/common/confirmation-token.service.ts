import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../common/send-email.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConfirmationTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sendEmailService: SendEmailService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async generateConfirmationLink(userId: string, email: string, role: UserRole, ait: number): Promise<void> {
    try {
      // Générer un token de confirmation
      const token = this.jwtService.sign(
        { userId: userId, role: role, email: email, ait: ait },
        { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '1h' }
      );

      // Trouver l'utilisateur dans la base de données
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      // Sauvegarder le token dans l'utilisateur
      //user.token_register = token;
      await this.userRepo.save(user);

      // Générer l'URL complète avec le token
      const confirmationLink = `${this.configService.get<string>('FRONTEND_URL')}/confirm?token=${token}`;

      // Envoyer un email à l'utilisateur avec le lien de confirmation
      const subject = 'Confirmez votre inscription';
      const message = `Cliquez sur le lien suivant pour valider votre inscription : <a href="${confirmationLink}">Confirmer mon inscription</a>`;

      await this.sendEmailService.sendEmail(email, subject, message);

    } catch (error) {
      throw new BadRequestException('Erreur lors de la génération du lien de confirmation');
    }
  }
}
