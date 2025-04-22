import { IsEnum, IsString } from "class-validator";
import { ReportStatus } from "../report.entity";

export class UpdateReportStatusDto {

    @IsString()
    reportId: string;

    @IsEnum(ReportStatus)
    status: ReportStatus;
}