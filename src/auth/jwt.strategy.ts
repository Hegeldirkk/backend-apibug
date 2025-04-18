import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service'; // Assurez-vous d'avoir un UserService pour récupérer l'utilisateur
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService, // Injection du service pour récupérer les utilisateurs
    private configService: ConfigService, // Injection du service de configuration pour récupérer la clé secrète
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    console.log('Utilisateur trouvé : ', user);
    return user; // L'utilisateur valide sera attaché à la requête
  }
}
