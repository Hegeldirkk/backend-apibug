import { User } from '../user/user.entity';
import { Report } from 'src/report/report.entity';
export declare class Hacker {
    id: string;
    nom: string;
    prenom: string;
    pseudo: string;
    sexe: 'M' | 'F';
    adresse: string;
    contact: string;
    dateNaissance: Date;
    siteWeb: string;
    aPropos: string;
    points: number;
    reseauxSociaux: {
        nom: string;
        lien: string;
    }[];
    publique: boolean;
    niveau: 'Novice' | 'Intermediaire' | 'Expert';
    user: User;
    reports: Report[];
    createdAt: Date;
    updatedAt: Date;
}
