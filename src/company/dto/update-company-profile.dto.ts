import {
    IsOptional,
    IsString,
    IsEmail,
    IsBoolean,
    IsDateString,
    IsArray,
  } from 'class-validator';
  
  export class UpdateProfileDto {
    // 📌 Infos générales
    @IsOptional()
    @IsString()
    nom?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    type_entreprise?: string;
  
    @IsOptional()
    @IsEmail()
    email_company?: string;
  
    @IsOptional()
    @IsString()
    language?: string;
  
    @IsOptional()
    @IsString()
    secteur?: string;
  
    @IsOptional()
    @IsString()
    statut_actuel?: string;
  
    // ☎️ Contact
    @IsOptional()
    @IsString()
    responsable_nom_complet?: string;
  
    @IsOptional()
    @IsString()
    responsable_contact?: string;
  
    @IsOptional()
    @IsString()
    fix?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    adresse?: string;
  
    @IsOptional()
    @IsString()
    urlSite?: string;
  
    // 🔑 Identité
    @IsOptional()
    @IsString()
    num_identification?: string;
  
    @IsOptional()
    @IsDateString()
    date_creation?: Date;
  
    @IsOptional()
    @IsString()
    pays?: string;
  
    @IsOptional()
    @IsString()
    longitude?: string;
  
    @IsOptional()
    @IsString()
    latitude?: string;
  
    // 👥 Réseaux Sociaux
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    reseaux_sociaux?: string[];
  
    // 🕒 Horaires
    @IsOptional()
    @IsString()
    horaires_ouverture?: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    langues?: string[];
  
  }
  