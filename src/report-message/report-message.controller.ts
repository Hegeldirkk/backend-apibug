// src/report-message/report-message.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
  Param,
  Body,
  Get,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ReportMessageService } from './report-message.service';
import { CreateReportMessageDto } from './dto/create-report-message.dto';
import { MarkMessageAsReadDto } from './dto/mark-as-read.dto';

@Controller('report-messages')
export class ReportMessageController {
  constructor(private readonly service: ReportMessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':reportId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async sendMessage(
    @Param('reportId') reportId: string,
    @Request() req,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() dto: CreateReportMessageDto,
  ) {
    const role = req.user.role;
    return this.service.createMessage({ ...dto, reportId }, files, {
      senderType: role,
      senderId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read')
  async markAsRead(@Body() dto: MarkMessageAsReadDto, @Request() req) {
    return this.service.markAsRead(dto.messageId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:reportId')
  async getMessages(@Param('reportId') reportId: string) {
    return this.service.getMessagesForReport(reportId);
  }
}
