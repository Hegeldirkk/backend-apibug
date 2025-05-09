import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Admin } from 'src/admin/admin.entity';
export declare class InitService implements OnApplicationBootstrap {
    private readonly userRepo;
    private readonly adminRepo;
    constructor(userRepo: Repository<User>, adminRepo: Repository<Admin>);
    onApplicationBootstrap(): Promise<void>;
}
