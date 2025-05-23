import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../common/send-email.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/user/user.entity';
export declare class ConfirmationTokenService {
    private readonly jwtService;
    private readonly sendEmailService;
    private readonly configService;
    private userRepo;
    constructor(jwtService: JwtService, sendEmailService: SendEmailService, configService: ConfigService, userRepo: Repository<User>);
    generateConfirmationLink(userId: string, email: string, role: UserRole, ait: number): Promise<void>;
    sendAdminAccountCreatedEmail(email: string, password: string): Promise<void>;
}
