import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { ConfirmationTokenService } from 'src/common/confirmation-token.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/update-password.dto';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
export declare class AuthService {
    private readonly configService;
    private userRepo;
    private jwtService;
    private readonly companyRepo;
    private readonly hackerRepo;
    private readonly confirmationTokenService;
    private readonly responseTransformer;
    constructor(configService: ConfigService, userRepo: Repository<User>, jwtService: JwtService, companyRepo: Repository<Company>, hackerRepo: Repository<Hacker>, confirmationTokenService: ConfirmationTokenService, responseTransformer: ResponseTransformerService);
    private sendConfirmationEmail;
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    registerHacker(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    private createUserBase;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        data: Record<string, any>;
    }>;
    verifyAccount(token: string): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
