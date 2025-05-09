import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/user/user.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
import { Program } from 'src/programs/program.entity';
import { Report } from 'src/report/report.entity';
export declare class CompanyService {
    private readonly companyRepo;
    private readonly programRepo;
    private readonly reportRepo;
    private readonly userRepo;
    private readonly uploadService;
    private readonly responseTransformer;
    constructor(companyRepo: Repository<Company>, programRepo: Repository<Program>, reportRepo: Repository<Report>, userRepo: Repository<User>, uploadService: UploadService, responseTransformer: ResponseTransformerService);
    getCompanyProfile(user: User): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    updateCompanyProfile(user: User, data: Partial<Company>): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    updateCompanyInfo(req: any, dto: UpdateCompanyDto, files: {
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
    }>;
    getStatistics(userId: string): Promise<{
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
