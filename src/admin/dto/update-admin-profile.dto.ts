import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateAdminProfileDto {
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
}
