import { Hacker } from 'src/hacker/hacker.entity';
import { Program } from 'src/programs/program.entity';
import { ReportMessage } from 'src/report-message/report-message.entity';
export declare enum ReportStatus {
    EN_ATTENTE = "en_attente",
    VALIDE = "valid\u00E9",
    REJETE = "rejet\u00E9"
}
export declare class Report {
    id: string;
    titre: string;
    description: string;
    preuves: {
        url: string;
        type: string;
    }[];
    vulnerability: string[];
    statut: ReportStatus;
    hacker: Hacker;
    markdown?: string;
    program: Program;
    messages: ReportMessage[];
    createdAt: Date;
    updatedAt: Date;
}
