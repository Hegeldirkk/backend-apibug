import { Company } from '../company/company.entity';
import { Report } from 'src/report/report.entity';
export declare enum ProgramStatus {
    NOUVEAU = "nouveau",
    ACTIF = "actif",
    FERME = "ferme",
    MODIFIED = "modified"
}
export declare class Program {
    id: string;
    titre: string;
    description: string;
    prix_bas: string;
    prix_moyen: string;
    prix_eleve?: string;
    prix_critique?: string;
    inscope: Array<{
        type: string;
        target: string;
        description: string;
    }>;
    outscope: Array<{
        cible: string;
        type: string;
        raison: string;
    }>;
    company: Company;
    reports: Report[];
    markdown: string;
    statut: ProgramStatus;
    createdAt: Date;
    updatedAt: Date;
}
