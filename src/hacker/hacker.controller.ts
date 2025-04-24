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

@Controller('hackers')
export class HackerController {
  constructor(private readonly hackerService: HackerService) {}

  // Profil du hacker connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@Request() req) {
    console.log(req.user.id);
    return this.hackerService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateHackerDto) {
    const hackerId = req.user.id;
    return this.hackerService.updateProfile(hackerId, dto);
  }

  // Profil d'un hacker spécifique par ID
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return this.hackerService.getProfile(id);
  }

  @Get()
  async findAll() {
    return await this.hackerService.getAllHackers();
  }

  @Get('public')
  async findPublicHackers() {
    return await this.hackerService.getPublicHackers();
  }

  @Get('private')
  async findPrivateHackers() {
    return await this.hackerService.getPrivateHackers();
  }

  @Get('ranking')
  async getRanking() {
    return await this.hackerService.getHackerRanking();
  }
}
