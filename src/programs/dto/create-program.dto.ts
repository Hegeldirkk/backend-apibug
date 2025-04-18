import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class InScopeDto {
  @IsString()
  type: string;

  @IsString()
  target: string;

  @IsString()
  description: string;
}

class OutScopeDto {
  @IsString()
  cible: string;

  @IsString()
  type: string;

  @IsString()
  raison: string;
}

export class CreateProgramDto {
  @IsString()
  titre: string;

  @IsString()
  description?: string;

  @IsString()
  prix_bas?: string;

  @IsString()
  prix_moyen?: string;

  @IsString()
  prix_eleve?: string;

  @IsString()
  prix_critique?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InScopeDto)
  inscope: InScopeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutScopeDto)
  outscope: OutScopeDto[];

  @IsString()
  markdown?: string;
}
