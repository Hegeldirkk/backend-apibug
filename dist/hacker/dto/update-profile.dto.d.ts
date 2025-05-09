export declare class SocialNetworkDto {
    nom: string;
    lien: string;
}
export declare class UpdateHackerDto {
    nom?: string;
    prenom?: string;
    contact?: string;
    pseudo?: string;
    sexe?: 'M' | 'F';
    adresse?: string;
    dateNaissance?: Date;
    siteWeb?: string;
    aPropos?: string;
    niveau?: 'Novice' | 'Intermediaire' | 'Expert';
    reseauxSociaux?: {
        nom: string;
        lien: string;
    }[];
    publique?: boolean;
}
