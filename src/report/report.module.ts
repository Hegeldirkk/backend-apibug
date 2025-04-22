// src/reports/report.module.ts

import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Program } from 'src/programs/program.entity';
import { UploadModule } from 'src/common/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Hacker, Program]),
  UploadModule
],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
