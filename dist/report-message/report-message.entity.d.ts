import { Report } from 'src/report/report.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
export type SenderType = 'hacker' | 'company';
export declare class ReportMessage {
    id: string;
    content: string;
    files?: {
        type: 'image' | 'video' | 'autre';
        url: string;
    }[];
    senderType: SenderType;
    readByHacker: boolean;
    readByCompany: boolean;
    hacker: Hacker;
    company: Company;
    report: Report;
    createdAt: Date;
    updatedAt: Date;
}
