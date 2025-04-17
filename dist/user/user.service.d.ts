import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findById(id: string): Promise<User | null>;
    getProfileByRole(user: User): Promise<{
        role: string;
        data: {
            nom?: string | undefined;
            description?: string | undefined;
            type_entreprise?: string | undefined;
            email_company?: string | undefined;
            language?: string | undefined;
            secteur?: string | undefined;
            statut_actuel?: string | undefined;
            responsable_nom_complet?: string | undefined;
            responsable_contact?: string | undefined;
            fix?: string | undefined;
            adresse?: string | undefined;
            urlSite?: string | undefined;
            num_identification?: string | undefined;
            registre_commerce?: string | undefined;
            date_creation?: Date | undefined;
            pays?: string | undefined;
            reseaux_sociaux?: string[] | undefined;
            horaires_ouverture?: string | undefined;
            modes_paiement?: string[] | undefined;
            logo?: string | undefined;
            id: string;
            email: string;
            role: UserRole.ENTREPRISE;
            statutCompte: import("./user.entity").StatutCompte;
            createdAt: Date;
            docSet: boolean;
        };
    } | {
        role: UserRole.SUPERADMIN | UserRole.ADMIN;
        data: {
            id: string;
            email: string;
            role: UserRole.SUPERADMIN | UserRole.ADMIN;
            statutCompte: import("./user.entity").StatutCompte;
            createdAt: Date;
        };
    } | {
        role: string;
        data: {
            id: string;
            email: string;
            role: UserRole.HACKER;
            statutCompte: import("./user.entity").StatutCompte;
            createdAt: Date;
        };
    } | {
        role: string;
        data: {
            id: string;
            email: string;
            role: never;
            statutCompte?: undefined;
            createdAt?: undefined;
        };
    }>;
}
