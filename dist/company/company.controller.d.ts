import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    updateCompany(req: any, dto: UpdateCompanyDto, files: {
        registre_commerce?: Express.Multer.File[];
        avatar?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
        statusCode?: undefined;
        error?: undefined;
    } | {
        statusCode: number;
        error: boolean;
        message: string;
        success?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    } | {
        success: boolean;
        message: string;
    }>;
    updateProfile(req: any, body: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    getStats(req: any, companyId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            nombreProgrammesActifs: number;
            nombreRapportsEnAttente: number;
            nombreHackers: number;
            nombreVulnerabilites: number;
        };
    }>;
}
