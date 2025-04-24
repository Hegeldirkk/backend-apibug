import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class RegisterAdminDto {
  @IsOptional()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  prenom: string;

  @IsString()
  contact: string;

  @IsEmail()
  email: string;
}
