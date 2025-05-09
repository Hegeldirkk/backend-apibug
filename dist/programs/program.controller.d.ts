import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramStatutDto } from './dto/update-statut-program.dto';
export declare class ProgramController {
    private readonly programService;
    constructor(programService: ProgramService);
    getProgramsByCompany(req: any): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    getProgramsByHacker(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./program.entity").Program[];
    }>;
    getAllHackerEntreprise(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../hacker/hacker.entity").Hacker[];
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
            company: import("../company/company.entity").Company;
            reports: import("../report/report.entity").Report[];
            markdown: string;
            statut: import("./program.entity").ProgramStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    addProgram(req: any, dto: CreateProgramDto): Promise<{
        success: boolean;
        message: string;
        data: import("./program.entity").Program;
    }>;
    updateProgram(req: any, id: string, dto: CreateProgramDto): Promise<any>;
    updateStatutProgram(req: any, id: string, dto: UpdateProgramStatutDto): Promise<any>;
}
