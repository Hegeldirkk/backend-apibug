import { ReportMessageService } from './report-message.service';
import { CreateReportMessageDto } from './dto/create-report-message.dto';
import { MarkMessageAsReadDto } from './dto/mark-as-read.dto';
export declare class ReportMessageController {
    private readonly service;
    constructor(service: ReportMessageService);
    sendMessage(req: any, files: {
        files?: Express.Multer.File[];
    }, dto: CreateReportMessageDto): Promise<{
        success: boolean;
        message: string;
        data: import("./report-message.entity").ReportMessage;
    }>;
    markAsRead(dto: MarkMessageAsReadDto, req: any): Promise<import("./report-message.entity").ReportMessage>;
    getMessages(reportId: string): Promise<{
        success: boolean;
        message: string;
        data: import("./report-message.entity").ReportMessage[];
    }>;
}
