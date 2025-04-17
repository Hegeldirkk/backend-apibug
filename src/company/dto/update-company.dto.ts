// src/company/dto/update-company.dto.ts
import { IsOptional, IsString, IsArray, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {

    @IsString()
    @IsNotEmpty()
    nom?: string; //

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string; //

    @IsString()
    @IsNotEmpty()
    type_entreprise?: string; //

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email_company?: string; //

    @IsString()
    @IsNotEmpty()
    language?: string; //

    @IsString()
    @IsNotEmpty()
    secteur?: string; //

    @IsString()
    statut_actuel?: string; //

    @IsString()
    responsable_nom_complet?: string; //

    @IsString()
    responsable_contact?: string; //

    @IsString()
    fix?: string; //

    @IsString()
    adresse?: string;

    @IsString()
    num_identification?: string; //

    @IsOptional()
    registre_commerce?: string; //

    @IsString()
    date_creation?: Date; //

    @IsOptional()
    logo?: string; //

}
