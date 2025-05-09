import { Repository } from 'typeorm';
import { Program } from './program.entity';
import { Company } from '../company/company.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { UpdateProgramStatutDto } from './dto/update-statut-program.dto';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
import { Hacker } from 'src/hacker/hacker.entity';
import { Report } from 'src/report/report.entity';
export declare class ProgramService {
    private programRepo;
    private companyRepo;
    private userRepo;
    private reportRepo;
    private readonly uploadService;
    private readonly responseTransformer;
    private readonly dataSource;
    constructor(programRepo: Repository<Program>, companyRepo: Repository<Company>, userRepo: Repository<User>, reportRepo: Repository<Report>, uploadService: UploadService, responseTransformer: ResponseTransformerService, dataSource: DataSource);
    getProgramsWithReportsAndHackers(req: any): Promise<{
        success: boolean;
        message: string;
        data: Program[];
    }>;
    getHackersForEntreprisePrograms(req: any): Promise<{
        success: boolean;
        message: string;
        data: Hacker[];
    }>;
    getProgramsByCompany(req: any): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    getAllProgramss(req: any): Promise<{
        success: boolean;
        message: string;
        data: Program[];
    }>;
    getAllPrograms(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            totalRapports: number;
            totalHackersUniques: number;
            totalVulnerabilites: number;
            id: string;
            titre: string;
            description: string;
            prix_bas: string;
            prix_moyen: string;
            prix_eleve?: string;
            prix_critique?: string;
            inscope: Array<{
                type: string;
                target: string;
                description: string;
            }>;
            outscope: Array<{
                cible: string;
                type: string;
                raison: string;
            }>;
            company: Company;
            reports: Report[];
            markdown: string;
            statut: import("./program.entity").ProgramStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createProgram(req: any, dto: CreateProgramDto): Promise<{
        success: boolean;
        message: string;
        data: Program;
    }>;
    updateProgram(req: any, programId: string, dto: CreateProgramDto): Promise<any>;
    updateStatusProgram(req: any, programId: string, dto: UpdateProgramStatutDto): Promise<any>;
}
