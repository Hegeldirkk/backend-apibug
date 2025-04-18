import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addProgram(@Request() req, @Body() dto: CreateProgramDto) {
    return this.programService.createProgram(req, dto);
  }
}
