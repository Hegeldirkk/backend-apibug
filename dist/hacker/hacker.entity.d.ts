import { User } from '../user/user.entity';
import { Report } from 'src/report/report.entity';
export declare class Hacker {
    id: string;
    nom: string;
    prenom: string;
    pseudo: string;
    sexe: 'M' | 'F';
    email: string;
    adresse: string;
    contact: string;
    dateNaissance: Date;
    pays: string;
    siteWeb: string;
    aPropos: string;
    reseauxSociaux: {
        nom: string;
        lien: string;
    }[];
    photo: string;
    publique: boolean;
    pushToken: string;
    niveau: 'Novice' | 'Intermediaire' | 'Expert';
    infoPiece: {
        numeroPiece: string;
        dateExpiration: Date;
        profession: string;
        nationalite: string;
        nomPere: string;
        lieuNaissance: string;
        nomMere: string;
        numeroIdentification: string;
        rectoImage: string;
        versoImage: string;
    };
    user: User;
    reports: Report[];
    createdAt: Date;
    updatedAt: Date;
}
