import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(dto: CreateCompanyDto): Promise<import("./company.entity").Company>;
    updateCompany(req: any, dto: UpdateCompanyDto, files: {
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
    findAll(): Promise<import("./company.entity").Company[]>;
    findOne(id: string): Promise<import("./company.entity").Company>;
    update(id: string, dto: UpdateCompanyDto): Promise<import("./company.entity").Company>;
    remove(id: string): Promise<import("./company.entity").Company>;
}
