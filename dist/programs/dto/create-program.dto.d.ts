declare class InScopeDto {
    type: string;
    target: string;
    description: string;
}
declare class OutScopeDto {
    cible: string;
    type: string;
    raison: string;
}
export declare class CreateProgramDto {
    titre: string;
    description?: string;
    prix_bas?: string;
    prix_moyen?: string;
    prix_eleve?: string;
    prix_critique?: string;
    inscope: InScopeDto[];
    outscope: OutScopeDto[];
    markdown?: string;
}
export {};
