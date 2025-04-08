// src/common/send-sms.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendSmsService {
  private readonly apiUrl: string;
  private readonly apiToken: string;
  private readonly apiUsername: string;
  private readonly sender: string;

  constructor(private readonly configService: ConfigService) {
    // Initialisation des configurations SMS avec valeurs par défaut
    this.apiUrl = this.configService.get<string>('SMS_API_URL', 'https://default-api-url.com'); // valeur par défaut
    this.apiToken = this.configService.get<string>('SMS_API_TOKEN', 'default-token'); // valeur par défaut
    this.apiUsername = this.configService.get<string>('SMS_API_USERNAME', 'default-username'); // valeur par défaut
    this.sender = this.configService.get<string>('SMS_API_SENDER', 'default-sender'); // valeur par défaut
  }

  // Fonction pour envoyer un SMS
  async sendSms(to: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(this.apiUrl, {
        username: this.apiUsername,
        token: this.apiToken,
        sender: this.sender,
        recipient: to,
        message: message,
      });

      if (response.data && response.data.status === 'success') {
        console.log('SMS envoyé avec succès');
        return true;
      } else {
        console.error('Erreur lors de l\'envoi du SMS:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
      return false;
    }
  }
}
