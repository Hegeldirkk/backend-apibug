// src/common/common.module.ts

import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { ConfigModule } from '@nestjs/config';
import { SendSmsService } from './send-sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { ConfirmationTokenService } from './confirmation-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  ConfigModule, JwtModule], // Importation du module de configuration pour accéder au fichier .env
  providers: [SendEmailService, SendSmsService, ConfirmationTokenService],
  exports: [SendEmailService, SendSmsService, ConfirmationTokenService], // Exporte le service pour pouvoir l'utiliser ailleurs
})
export class CommonModule {}
