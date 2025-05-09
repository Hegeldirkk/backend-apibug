import { Repository } from 'typeorm';
import { ReportMessage } from './report-message.entity';
import { CreateReportMessageDto } from './dto/create-report-message.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Report } from 'src/report/report.entity';
export declare class ReportMessageService {
    private readonly repo;
    private readonly uploadService;
    private readonly hackerRepo;
    private readonly companyRepo;
    private readonly reportRepo;
    constructor(repo: Repository<ReportMessage>, uploadService: UploadService, hackerRepo: Repository<Hacker>, companyRepo: Repository<Company>, reportRepo: Repository<Report>);
    detectFileType(filePath: string): 'image' | 'video' | 'autre';
    createMessage(req: any, dto: CreateReportMessageDto, files: {
        files?: Express.Multer.File[];
    }, data: {
        senderType: 'hacker' | 'company';
        senderId: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: ReportMessage;
    }>;
    markAsRead(messageId: string, readerType: 'hacker' | 'company'): Promise<ReportMessage>;
    getMessagesForReport(reportId: string): Promise<{
        success: boolean;
        message: string;
        data: ReportMessage[];
    }>;
}
