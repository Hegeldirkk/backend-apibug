import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
}
