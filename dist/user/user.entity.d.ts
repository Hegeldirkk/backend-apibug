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
    otp_code: string;
    otp_expire_at: Date;
    verified: boolean;
    docSet: boolean;
    role: UserRole;
    emailRecuperation?: string;
    emailChangePending?: string;
    emailChangeToken?: string;
    codesRecuperation?: string[];
    usedRecoveryCodes?: string[];
    compteDesactivable: boolean;
    compteSupprimable: boolean;
    statutCompte: StatutCompte;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    verificationSentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
