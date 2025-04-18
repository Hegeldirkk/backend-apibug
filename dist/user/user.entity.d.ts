import { Company } from 'src/company/company.entity';
export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    ENTREPRISE = "company",
    HACKER = "hacker"
}
export declare enum StatutCompte {
    ACTIF = "actif",
    INACTIF = "inactif",
    SUSPENDU = "suspendu",
    PENDING = "pending",
    BANNI = "banni"
}
export declare class User {
    id: string;
    email: string;
    numeroTelephone: string;
    password: string;
    avatar: string;
    otp_code: string;
    otp_expire_at: Date;
    verified: boolean;
    docSet: boolean;
    role: UserRole;
    emailRecuperation?: string;
    codesRecuperation?: string[];
    usedRecoveryCodes?: string[];
    statutCompte: StatutCompte;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
}
