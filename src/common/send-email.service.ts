// src/common/send-email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Initialisation du transporteur avec la configuration SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE'), // true pour SSL/TLS
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  // Fonction pour envoyer un email
  async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'), // Adresse d'expédition
        to: to, // Destinataire
        subject: subject, // Sujet
        text: text, // Texte brut 
      });

      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }
}
