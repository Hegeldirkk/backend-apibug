import { User } from 'src/user/user.entity';
export declare class Admin {
    id: string;
    user: User;
    nom?: string;
    prenom?: string;
    contact?: string;
    createdAt: Date;
    updatedAt: Date;
}
