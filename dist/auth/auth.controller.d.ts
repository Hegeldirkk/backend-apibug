import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/update-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerHacker(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
