import { AdminService } from './admin.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getProfile(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("./admin.entity").Admin;
        message?: undefined;
    }>;
    updateProfile(req: any, dto: UpdateAdminProfileDto): Promise<any>;
    getStats(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            hackers: {
                total: number;
                thisMonth: number;
                lastMonth: number;
                growth: number;
                latest: import("../hacker/hacker.entity").Hacker[];
            };
            companies: {
                total: number;
                thisMonth: number;
                lastMonth: number;
                growth: number;
                latest: {
                    id: string;
                    nom: string | undefined;
                    email: string;
                    createdAt: Date;
                    nbProgrammes: number;
                }[];
            };
            programs: {
                totalActive: number;
                thisMonth: number;
                lastMonth: number;
                growth: number;
            };
            monthlyRegistrations: {
                month: string;
                hackers: number;
                companies: number;
            }[];
        };
    } | {
        success: boolean;
        message: string;
    }>;
    getCompaniesDetails(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
    }>;
    getHackersStats(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
    }>;
    getHackersRanking(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
    }>;
    getProgramsParticipation(req: any): Promise<{
        program: import("../programs/program.entity").Program;
        nbHackers: number;
    }[] | {
        success: boolean;
        message: string;
    }>;
}
