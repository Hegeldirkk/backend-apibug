// src/report/dto/create-report.dto.ts

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class VulnerabilityDto {
  @IsString()
  type: string;

  @IsString()
  description: string;
}

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  preuves?: Array<{ type: 'image' | 'video' | 'autre'; url: string }>;

  @IsString({ each: true })
  vulnerability: string[];

  @IsString()
  programId: string;

  @IsString()
  markdown?: string;
}
