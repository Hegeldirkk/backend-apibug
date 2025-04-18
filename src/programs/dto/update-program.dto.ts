import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateProgramDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  prix_bas?: number;

  @IsOptional()
  @IsNumber()
  prix_moyen?: number;

  @IsOptional()
  @IsNumber()
  prix_eleve?: number;

  @IsOptional()
  @IsNumber()
  prix_critique?: number;

  @IsOptional()
  @IsArray()
  inscope?: any[]; // Tu peux aussi créer une classe DTO pour structurer les items si tu veux

  @IsOptional()
  @IsArray()
  outscope?: any[];

  @IsOptional()
  @IsString()
  markdown?: string;
}
