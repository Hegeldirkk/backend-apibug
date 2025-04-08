import { User, UserRole } from '../user/user.entity';
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
    register(dto: RegisterDto, role: UserRole): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            verified: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: UserRole;
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
            };
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
