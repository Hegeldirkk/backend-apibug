import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
  Put,
} from '@nestjs/common';
import { HackerService } from './hacker.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateHackerDto } from './dto/update-profile.dto';
import { UserRole } from 'src/user/user.entity';

@Controller('hackers')
export class HackerController {
  constructor(private readonly hackerService: HackerService) {}

  // Profil du hacker connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@Request() req) {

    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.HACKER && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }

    console.log(req.user.id);
    return this.hackerService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateHackerDto) {
    const role = req.user.role;
    const ait = req.user.ait;
    if (role !== UserRole.HACKER && ait !== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    const userId = req.user.id;
    return this.hackerService.updateProfile(userId, dto);
  }

  // Profil d'un hacker spécifique par ID
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return this.hackerService.getProfile(id);
  }

  // Obtenir tous les hackers
  @Get()
  async findAll() {
    return await this.hackerService.getAllHackers();
  }

  // Obtenir les hackers publics
  @Get('public')
  async findPublicHackers() {
    return await this.hackerService.getPublicHackers();
  }

  // Obtenir les hackers privés
  @Get('private')
  async findPrivateHackers() {
    return await this.hackerService.getPrivateHackers();
  }

  //classer les hackers
  @Get('ranking')
  async getRanking() {
    return await this.hackerService.getHackerRanking();
  }
}
