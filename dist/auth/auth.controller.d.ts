import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/user/user.entity';
import { ChangePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerHacker(dto: RegisterDto, res: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            verified: boolean;
        };
    }>;
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            verified: boolean;
        };
    }>;
    registerAdmin(dto: RegisterDto): Promise<{
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
