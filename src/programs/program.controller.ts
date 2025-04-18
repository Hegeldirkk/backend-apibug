import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Put,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProgramStatutDto } from './dto/update-statut-program.dto';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-company')
  async getProgramsByCompany(@Request() req) {
    return this.programService.getProgramsByCompany(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllPrograms(@Request() req) {
    return this.programService.getAllPrograms(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addProgram(@Request() req, @Body() dto: CreateProgramDto) {
    return this.programService.createProgram(req, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProgram(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CreateProgramDto,
  ) {
    return this.programService.updateProgram(req, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('statut/:id')
  async updateStatutProgram(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateProgramStatutDto,
  ) {
    return this.programService.updateStatusProgram(req, id, dto);
  }
}
