import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyService {
    private readonly companyRepo;
    constructor(companyRepo: Repository<Company>);
    private initializeUploadDirectories;
    private validateFile;
    private ensureDirectoryExists;
    private generateUniqueFileName;
    private saveFile;
    create(data: CreateCompanyDto): Promise<Company>;
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    update(id: string, data: UpdateCompanyDto): Promise<Company>;
    updateCompanyInfo(req: any, dto: UpdateCompanyDto, files: {
        registre_commerce?: Express.Multer.File[];
        logo?: Express.Multer.File[];
    }): Promise<{
        error: boolean;
        message: string;
        data: {
            company: {
                id: string;
                nom: string | undefined;
                description: string | undefined;
                type_entreprise: string | undefined;
                email_company: string | undefined;
                language: string | undefined;
                secteur: string | undefined;
                statut_actuel: string | undefined;
                verfied: boolean;
                registre_commerce: string | undefined;
                logo: string | undefined;
                responsable_nom_complet: string;
                responsable_contact: string | undefined;
                fix: string | undefined;
                email: string;
                adresse: string | undefined;
                urlSite: string | undefined;
                num_identification: string | undefined;
            };
            user: {
                id: string;
                email: string;
                numeroTelephone: string;
                role: import("../user/user.entity").UserRole;
                statutCompte: import("../user/user.entity").StatutCompte;
                verified: boolean;
                docSet: boolean;
            };
        };
        statusCode?: undefined;
    } | {
        statusCode: number;
        error: boolean;
        message: string;
        data?: undefined;
    }>;
    remove(id: string): Promise<Company>;
    private saveFiles;
    private cleanupUploadedFiles;
}
