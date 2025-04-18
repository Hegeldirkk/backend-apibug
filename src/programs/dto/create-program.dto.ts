import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class ScopeDto {
  @IsString()
  type: string;

  @IsString()
  target: string;

  @IsString()
  description: string;
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
  @Type(() => ScopeDto)
  inscope: ScopeDto[];

  @IsString()
  markdown?: string;
}
