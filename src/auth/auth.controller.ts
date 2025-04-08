import { Controller, Request, Post, Body, Res, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/user/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/hacker')
  async registerHacker(@Body() dto: RegisterDto, @Res() res: Response) {
    const role = UserRole.HACKER
    return this.authService.register(dto, role);
  }


  @Post('register/company')
  async registerCompany(@Body() dto: RegisterDto) {
    const role = UserRole.ENTREPRISE
    return this.authService.register(dto, role);
  }

  @Post('register/admin')
  async registerAdmin(@Body() dto: RegisterDto) {
    const role = UserRole.ADMIN
    return this.authService.register(dto, role);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify/:token')
  async verifyAccount(@Param('token') token: string) {
    try {
      const result = await this.authService.verifyAccount(token);
      return result;
    } catch (error) {
      throw new BadRequestException('Le lien de confirmation est invalide ou expiré');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/psw')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.id;
    return this.authService.changePassword(userId, dto);
  }

}
