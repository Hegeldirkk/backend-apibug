import { Repository } from 'typeorm';
import { Hacker } from './hacker.entity';
import { User } from 'src/user/user.entity';
import { ResponseTransformerService } from 'src/common/services/response-transformer.service';
export declare class HackerService {
    private hackerRepo;
    private readonly userRepo;
    private readonly responseTransformer;
    constructor(hackerRepo: Repository<Hacker>, userRepo: Repository<User>, responseTransformer: ResponseTransformerService);
    getProfile(id: string): Promise<any>;
    updateProfile(id: string, dto: Partial<Hacker>): Promise<any>;
    getAllHackers(): Promise<any>;
    getPublicHackers(): Promise<any>;
    getPrivateHackers(): Promise<any>;
    getHackerRanking(): Promise<any>;
}
