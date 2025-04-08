// src/company/dto/update-company.dto.ts
import { IsOptional, IsString, IsArray, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {

    @IsString()
    @IsNotEmpty()
    nom?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsString()
    @IsNotEmpty()
    type_entreprise?: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email_company?: string;

    @IsString()
    @IsNotEmpty()
    language?: string;

    @IsString()
    @IsNotEmpty()
    secteur?: string;

    @IsString()
    statut_actuel?: string;

    @IsString()
    responsable_nom_complet?: string;

    @IsString()
    responsable_contact?: string;

    @IsOptional()
    @IsString()
    fix?: string;

    @IsString()
    adresse?: string;

    @IsOptional()
    @IsString()
    urlSite?: string;

    @IsString()
    num_identification?: string;

    @IsString()
    registre_commerce?: string;

    @IsDateString()
    date_creation?: Date;

    @IsOptional()
    @IsString()
    pays?: string;

    @IsOptional()
    @IsArray()
    reseaux_sociaux?: string[];

    @IsOptional()
    @IsString()
    horaires_ouverture?: string;

    @IsOptional()
    @IsArray()
    modes_paiement?: string[];

    @IsString()
    logo?: string;

}
