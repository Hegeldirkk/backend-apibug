import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { User } from 'src/user/user.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Program } from 'src/programs/program.entity';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
export declare class AdminService {
    private readonly adminRepo;
    private readonly userRepo;
    private hackerRepo;
    private companyRepo;
    private programRepo;
    private readonly responseTransformer;
    constructor(adminRepo: Repository<Admin>, userRepo: Repository<User>, hackerRepo: Repository<Hacker>, companyRepo: Repository<Company>, programRepo: Repository<Program>, responseTransformer: ResponseTransformerService);
    getProfile(userId: string): Promise<Admin>;
    updateProfile(userId: string, dto: UpdateAdminProfileDto): Promise<any>;
    getStats(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            hackers: {
                total: number;
                thisMonth: number;
                lastMonth: number;
                growth: number;
                latest: Hacker[];
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
    }>;
    getCompaniesDetails(): Promise<any[]>;
    getHackersSuccessRate(): Promise<any[]>;
    getHackersRanking(): Promise<any[]>;
    getProgramsWithHackerParticipation(): Promise<{
        program: Program;
        nbHackers: number;
    }[]>;
}
