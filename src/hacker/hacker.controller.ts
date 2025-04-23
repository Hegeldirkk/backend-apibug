import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { HackerService } from './hacker.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

  // Profil d'un hacker spécifique par ID
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return this.hackerService.getProfile(id);
  }

}
