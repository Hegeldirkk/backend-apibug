import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { IsJWT } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const admin = await this.adminService.getProfile(req.user.id);
    return {
      success: true,
      data: admin,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() dto: UpdateAdminProfileDto) {
    return await this.adminService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    return await this.adminService.getStats(req.user.id);
  }
}
