// src/reports/report.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Put,
  Param,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getAllReports() {
    return this.reportService.findAll();
  }

  @Get('by-program/:programId')
  async getReportsByProgram(@Param('programId') programId: string) {
    return this.reportService.findByProgram(programId);
  }

  @Get('by-company')
  @UseGuards(JwtAuthGuard)
  async getReportsByCompany(@Request() req) {
    const companyId = req.user.id; // on récupère l'id de l'entreprise de l'utilisateur connecté
    return this.reportService.findByCompany(companyId);
  }

  @Get('by-hacker')
  @UseGuards(JwtAuthGuard)
  async getReportsByHacker(@Request() req) {
    const hackerId = req.user.id; // on récupère l'id du hacker de l'utilisateur connecté
    return this.reportService.findByHacker(hackerId);
  }

  //ajouter un rapport
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'preuves', maxCount: 5 }]))
  async create(
    @Body() dto: CreateReportDto,
    @Request() req,
    @UploadedFiles()
    files: {
      preuves?: Express.Multer.File[];
    },
  ) {
    const hackerId = req.user.id; // ou `req.user.id` selon ton JWT
    return this.reportService.create(dto, hackerId, files);
  }

  //changer le statut d'un rapport
  @UseGuards(JwtAuthGuard)
  @Put('status')
  async status(@Body() dto: UpdateReportStatusDto, @Request() req) {
    const companyId = req.user.id; // ou `req.user.id` selon ton JWT
    return this.reportService.updateStatus(dto, companyId);
  }
}
