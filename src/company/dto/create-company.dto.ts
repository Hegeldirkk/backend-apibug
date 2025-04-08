import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsOptional() @IsString() nom?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() secteur?: string;
  @IsOptional() @IsString() statut_actuel?: string;

  @IsEmail()
  email: string;

  @IsOptional() @IsString() adresse?: string;
  @IsOptional() @IsString() contact?: string;
  @IsOptional() @IsString() fix?: string;
  @IsOptional() @IsString() urlSite?: string;
  @IsOptional() @IsString() num_identification?: string;
  @IsOptional() @IsString() registre_commerce?: string;
  @IsOptional() date_creation?: Date;
  @IsOptional() @IsString() localisation?: string;
  @IsOptional() @IsString() pays?: string;

  @IsOptional() reseaux_sociaux?: string[];
  @IsOptional() langues?: string[];
  @IsOptional() modes_paiement?: string[];
  @IsOptional() services?: string[];
  @IsOptional() @IsString() responsable?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() documents?: string[];
}
