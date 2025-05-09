// src/report-message/report-message.service.ts

import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportMessage } from './report-message.entity';
import { CreateReportMessageDto } from './dto/create-report-message.dto';
import { UploadService } from 'src/common/upload/upload.service';
import * as path from 'path';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Report } from 'src/report/report.entity';
@Injectable()
export class ReportMessageService {
  constructor(
    @InjectRepository(ReportMessage)
    private readonly repo: Repository<ReportMessage>,
    private readonly uploadService: UploadService,

    @InjectRepository(Hacker)
    private readonly hackerRepo: Repository<Hacker>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  detectFileType(filePath: string): 'image' | 'video' | 'autre' {
    const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext))
      return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'video';
    return 'autre';
  }

  async createMessage(
    @Request() req,
    dto: CreateReportMessageDto,
    files: { files?: Express.Multer.File[] },
    data: {
      senderType: 'hacker' | 'company';
      senderId: string;
    },
  ) {
    let uploadedFiles: { type: 'image' | 'video' | 'autre'; url: string }[] =
      [];

    if (files?.files && Array.isArray(files.files)) {
      const targetDir = path.join(
        'uploads',
        `messages`,
        `sender_${data.senderType}_${data.senderId}`,
      );

      const savedFiles = await Promise.all(
        files.files.map((file) => this.uploadService.saveFile(file, targetDir)),
      );

      uploadedFiles = savedFiles
        .filter((file) => file.success && file.filePath)
        .map((file) => ({
          type: this.detectFileType(file.filePath!),
          url: file.filePath!,
        }));
    }

    const message = new ReportMessage();
    message.content = dto.content;
    message.files = uploadedFiles;
    message.senderType = data.senderType;
    message.report = { id: dto.reportId } as any;

    if (data.senderType === 'hacker') {
      // Récupérer le hacker lié à l'utilisateur connecté
      const hacker = await this.hackerRepo.findOne({
        where: { user: { id: req.user.id } },
      });

      if (!hacker) {
        throw new NotFoundException('Hacker non trouvé pour cet utilisateur.');
      }

      message.hacker = hacker;
    } else if (data.senderType === 'company') {
      // Récupérer la company liée à l'utilisateur connecté
      const company = await this.companyRepo.findOne({
        where: { user: { id: req.user.id } },
      });

      if (!company) {
        throw new NotFoundException(
          'Entreprise non trouvée pour cet utilisateur.',
        );
      }

      message.company = company;
    }

    const savedMessage = await this.repo.save(message);

    return {
      success: true,
      message: 'Message envoyé avec succès',
      data: savedMessage,
    };
  }

  async markAsRead(messageId: string, readerType: 'hacker' | 'company') {
    const message = await this.repo.findOneByOrFail({ id: messageId });

    if (readerType === 'hacker') {
      message.readByHacker = true;
    } else {
      message.readByCompany = true;
    }

    return this.repo.save(message);
  }

  async getMessagesForReport(reportId: string) {
    console.log('Fetching messages for report:', reportId);

    const messages = await this.repo.find({
      where: { report: { id: reportId } },
      relations: ['hacker', 'company'],
      order: { createdAt: 'ASC' },
    });

    if (messages.length === 0) {
      return {
        success: true,
        message: 'Aucun message trouvé pour ce rapport',
        data: [],
      };
    }

    return {
      success: true,
      message: 'Messages récupérés avec succès',
      data: messages,
    };
  }
}
