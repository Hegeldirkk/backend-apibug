export declare class VulnerabilityDto {
    type: string;
    description: string;
}
export declare class CreateReportDto {
    titre: string;
    description: string;
    preuves?: Array<{
        type: 'image' | 'video' | 'autre';
        url: string;
    }>;
    vulnerability: string[];
    programId: string;
    markdown?: string;
}
