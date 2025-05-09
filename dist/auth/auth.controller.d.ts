import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/update-password.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerHacker(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    registerAdmin(req: any, dto: RegisterAdminDto): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    } | {
        success: boolean;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        data: Record<string, any>;
    }>;
    loginAdmin(dto: LoginAdminDto): Promise<{
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
