import { HackerService } from './hacker.service';
import { UpdateHackerDto } from './dto/update-profile.dto';
export declare class HackerController {
    private readonly hackerService;
    constructor(hackerService: HackerService);
    getMyProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateHackerDto): Promise<any>;
    getProfileById(id: string): Promise<any>;
    findAll(): Promise<any>;
    findPublicHackers(): Promise<any>;
    findPrivateHackers(): Promise<any>;
    getRanking(): Promise<any>;
}
