import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Company } from 'src/company/company.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { CompanyModule } from 'src/company/company.module';
import { CommonModule } from 'src/common/common.module';
import { ConfirmationTokenService } from 'src/common/confirmation-token.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from 'src/user/user.module';
import { Admin } from 'src/admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, Hacker, Admin]),
    CompanyModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    CommonModule, // Assurez-vous que CommonModule contient le service de confirmation
    UserModule 
  ],
  providers: [
    AuthService,
    ConfirmationTokenService,
    JwtAuthGuard,
    JwtStrategy // Ajout du service de confirmation
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtAuthGuard], // Exporte le guard si tu veux l'utiliser ailleurs

})
export class AuthModule {}
