import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    updateCompany(req: any, dto: UpdateCompanyDto, files: {
        registre_commerce?: Express.Multer.File[];
        logo?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            numeroTelephone: string;
            role: import("../user/user.entity").UserRole;
            statutCompte: import("../user/user.entity").StatutCompte;
            verified: boolean;
            docSet: boolean;
            avatar: string;
            nom: string | undefined;
            description: string | undefined;
            type_entreprise: string | undefined;
            email_company: string | undefined;
            language: string | undefined;
            secteur: string | undefined;
            statut_actuel: string | undefined;
            verfied: boolean;
            registre_commerce: string | undefined;
            responsable_nom_complet: string;
            responsable_contact: string | undefined;
            fix: string | undefined;
            adresse: string | undefined;
            urlSite: string | undefined;
            num_identification: string | undefined;
        };
        statusCode?: undefined;
        error?: undefined;
    } | {
        statusCode: number;
        error: boolean;
        message: string;
        success?: undefined;
        data?: undefined;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            role: import("../user/user.entity").UserRole;
            statut: import("../user/user.entity").StatutCompte;
            verified: boolean;
            email: string;
            avatar: string;
            nom: string | undefined;
            description: string | undefined;
            type_entreprise: string | undefined;
            email_company: string | undefined;
            language: string | undefined;
            secteur: string | undefined;
            statut_actuel: string | undefined;
            responsable_nom_complet: string;
            responsable_contact: string | undefined;
            fix: string | undefined;
            adresse: string | undefined;
            urlSite: string | undefined;
            num_identification: string | undefined;
            registre_commerce: string | undefined;
            date_creation: Date | undefined;
            pays: string | undefined;
            longitude: string | undefined;
            latitude: string | undefined;
            reseaux_sociaux: string[] | undefined;
            horaires_ouverture: string | undefined;
            langues: string[] | undefined;
            modes_paiement: string[] | undefined;
            services: string[] | undefined;
            document_outscope: string | undefined;
            inscope: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateProfile(req: any, body: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: import("./company.entity").Company;
    }>;
}
