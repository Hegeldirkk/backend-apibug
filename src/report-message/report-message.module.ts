import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportMessage } from './report-message.entity';
import { ReportMessageService } from './report-message.service';
import { ReportMessageController } from './report-message.controller';
import { UploadModule } from 'src/common/upload/upload.module';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Report } from 'src/report/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportMessage, Hacker, Company, Report]), UploadModule],
  controllers: [ReportMessageController],
  providers: [ReportMessageService],
})
export class ReportMessageModule {}
