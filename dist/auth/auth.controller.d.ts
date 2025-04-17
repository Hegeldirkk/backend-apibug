import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/user/user.entity';
import { ChangePasswordDto } from './dto/update-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerHacker(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                verified: boolean;
                statut: import("src/user/user.entity").StatutCompte;
                role: UserRole;
                docSet: boolean;
            };
        };
    }>;
    registerCompany(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                verified: boolean;
                statut: import("src/user/user.entity").StatutCompte;
                role: UserRole;
                docSet: boolean;
            };
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
                statut: import("src/user/user.entity").StatutCompte;
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
                statut: import("src/user/user.entity").StatutCompte;
                docSet: boolean;
                verified: boolean;
            };
        };
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
