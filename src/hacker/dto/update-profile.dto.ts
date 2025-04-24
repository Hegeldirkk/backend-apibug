import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocialNetworkDto {
  @IsString()
  nom: string;

  @IsString()
  lien: string;
}

export class UpdateHackerDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(01|05|07|25)\d{8}$/, {
    message: 'Le contact doit être un numéro ivoirien valide de 10 chiffres',
  })
  contact?: string;

  @IsOptional()
  @IsString()
  pseudo?: string;

  @IsOptional()
  @IsEnum(['M', 'F'])
  sexe?: 'M' | 'F';

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsDateString()
  dateNaissance?: Date;

  @IsOptional()
  @IsString()
  siteWeb?: string;

  @IsOptional()
  @IsString()
  aPropos?: string;

  @IsOptional()
  @IsEnum(['Novice', 'Intermediaire', 'Expert'])
  niveau?: 'Novice' | 'Intermediaire' | 'Expert';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialNetworkDto)
  reseauxSociaux?: { nom: string; lien: string }[];

  @IsOptional()
  @IsBoolean()
  publique?: boolean;
}
