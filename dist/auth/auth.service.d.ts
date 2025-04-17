import { StatutCompte, User, UserRole } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { ConfirmationTokenService } from 'src/common/confirmation-token.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/update-password.dto';
export declare class AuthService {
    private readonly configService;
    private userRepo;
    private jwtService;
    private readonly companyRepo;
    private readonly hackerRepo;
    private readonly confirmationTokenService;
    constructor(configService: ConfigService, userRepo: Repository<User>, jwtService: JwtService, companyRepo: Repository<Company>, hackerRepo: Repository<Hacker>, confirmationTokenService: ConfirmationTokenService);
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                verified: boolean;
                statut: StatutCompte;
                role: UserRole;
                docSet: boolean;
            };
        };
    }>;
    registerHacker(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                verified: boolean;
                statut: StatutCompte;
                role: UserRole;
                docSet: boolean;
            };
        };
    }>;
    private createUserBase;
    private sendConfirmationEmail;
    private buildRegisterResponse;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: UserRole;
                statut: StatutCompte;
                docSet: boolean;
                verified: boolean;
            };
        };
    }>;
    verifyAccount(token: string): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: UserRole;
                statut: StatutCompte;
                docSet: boolean;
                verified: boolean;
            };
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
