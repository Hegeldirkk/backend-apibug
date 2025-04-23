import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateSelfie(req: any, files: {
        logo?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: import("./user.entity").User;
    }>;
}
