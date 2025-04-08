import { Injectable } from '@nestjs/common';
import { SendSmsService } from '../common/send-sms.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class OtpService {
  constructor(
    private readonly sendSmsService: SendSmsService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Génère un OTP sécurisé à 6 chiffres
  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Sauvegarder l'OTP dans la base de données avec un temps d'expiration
  async saveOtp(phoneNumber: string, otp: string): Promise<void> {
    const otpRecord = this.userRepo.create({
        numeroTelephone: phoneNumber,
        otp_code: otp,
        otp_expire_at: new Date(Date.now() + 3 * 60000), // L'OTP expire après 3 minutes
    });
    await this.userRepo.save(otpRecord);
  }

  // Vérifier si l'OTP est valide
  async verifyOtp(numeroTelephone: string, otp_code: string): Promise<boolean> {
    const otpRecord = await this.userRepo.findOne({
      where: { numeroTelephone, otp_code },
    });

    if (!otpRecord) {
      return false;
    }

    // Vérifie si l'OTP est expiré
    if (otpRecord.otp_expire_at < new Date()) {
      return false;
    }

    // L'OTP est valide
    return true;
  }

  // Envoie l'OTP par SMS
  async sendOtp(phoneNumber: string): Promise<void> {
    const otp = this.generateOtp();

    // Sauvegarder l'OTP dans la base de données
    await this.saveOtp(phoneNumber, otp);

    // Envoyer l'OTP par SMS
    const message = `Votre code OTP est : ${otp}. Il expire dans 3 minutes.`;
    console.log('le code otp est :', otp);
    await this.sendSmsService.sendSms(phoneNumber, message);
  }
}
