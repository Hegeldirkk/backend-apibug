import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportMessage } from './report-message.entity';
import { ReportMessageService } from './report-message.service';
import { ReportMessageController } from './report-message.controller';
import { UploadModule } from 'src/common/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportMessage]), UploadModule],
  controllers: [ReportMessageController],
  providers: [ReportMessageService],
})
export class ReportMessageModule {}
