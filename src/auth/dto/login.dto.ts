import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
    
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    {
      message:
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    }
  )
  password: string;
}
