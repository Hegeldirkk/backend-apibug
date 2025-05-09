export declare class CreateReportMessageDto {
    content: string;
    reportId: string;
    files: Array<{
        type: 'image' | 'video' | 'autre';
        url: string;
    }>;
}
