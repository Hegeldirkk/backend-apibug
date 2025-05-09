import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Program } from 'src/programs/program.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { User } from 'src/user/user.entity';
export declare class ReportService {
    private reportRepo;
    private hackerRepo;
    private userRepo;
    private programRepo;
    private readonly uploadService;
    constructor(reportRepo: Repository<Report>, hackerRepo: Repository<Hacker>, userRepo: Repository<User>, programRepo: Repository<Program>, uploadService: UploadService);
    private detectFileType;
    findAll(): Promise<Report[]>;
    findByProgram(programId: string): Promise<Report[]>;
    findByCompany(userId: string): Promise<{
        success: boolean;
        message: string;
        data: Report[];
    }>;
    findByHacker(hackerId: string): Promise<Report[]>;
    create(dto: CreateReportDto, hackerId: string, files: {
        preuves?: Express.Multer.File[];
    }): Promise<any>;
    updateStatus(dto: UpdateReportStatusDto, userId: string): Promise<any>;
    getAllReportsWithMessages(): Promise<Report[]>;
}
