// src/auth/dto/change-password.dto.ts

import { IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  
  @IsString()
  oldPassword: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    {
      message:
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    }
  )
  newPassword: string;
}
