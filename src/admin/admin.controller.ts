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
import { UserRole } from 'src/user/user.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    const admin = await this.adminService.getProfile(req.user.id);
    return {
      success: true,
      data: admin,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() dto: UpdateAdminProfileDto) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return await this.adminService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return await this.adminService.getStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('companies')
  async getCompaniesDetails(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return {
      success: true,
      message: 'liste des entreprises',
      data: await this.adminService.getCompaniesDetails(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('hackers')
  async getHackersStats(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return {
      success: true,
      message: 'liste des hackers',
      data: await this.adminService.getHackersSuccessRate(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('classement-hackers')
  async getHackersRanking(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return {
      success: true,
      message: 'classement des hackers',
      data: await this.adminService.getHackersRanking(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('programs')
  async getProgramsParticipation(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPERADMIN && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return this.adminService.getProgramsWithHackerParticipation();
  }
}
