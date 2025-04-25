import { Controller, Request, Post, Body, Res, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/user/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/hacker')
  async registerHacker(@Body() dto: RegisterDto) {
    return this.authService.registerHacker(dto);
  }


  @Post('register/company')
  async registerCompany(@Body() dto: RegisterDto) {
    return this.authService.registerCompany(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('register/admin')
  async registerAdmin(@Request() req, @Body() dto: RegisterAdminDto) {
    const userole = req.user.role;
    const ait = req.user.ait;
    if (userole !== 'superadmin' && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    const role = UserRole.ADMIN
    return this.authService.registerAdmin(req, dto, role);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('login/admin')
  async loginAdmin(@Body() dto: LoginAdminDto) {
    return this.authService.loginAdmin(dto);
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
    const ait = req.user.ait;
    if (ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    const userId = req.user.id;
    return this.authService.changePassword(userId, dto);
  }

}
