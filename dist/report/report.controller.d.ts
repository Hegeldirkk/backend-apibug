import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getAllReports(): Promise<import("./report.entity").Report[]>;
    getReportsByProgram(programId: string): Promise<import("./report.entity").Report[]>;
    getReportsByCompany(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./report.entity").Report[];
    }>;
    getReportsByHacker(req: any): Promise<import("./report.entity").Report[]>;
    create(dto: CreateReportDto, req: any, files: {
        preuves?: Express.Multer.File[];
    }): Promise<any>;
    status(dto: UpdateReportStatusDto, req: any): Promise<any>;
    getReportsWithMessages(req: any): Promise<import("./report.entity").Report[] | {
        success: boolean;
        message: string;
    }>;
}
