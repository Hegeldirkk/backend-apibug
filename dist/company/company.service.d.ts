import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyService {
    private readonly companyRepo;
    constructor(companyRepo: Repository<Company>);
    create(data: CreateCompanyDto): Promise<Company>;
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    update(id: string, data: UpdateCompanyDto): Promise<Company>;
    updateCompanyInfo(userId: string, dto: UpdateCompanyDto, files?: {
        [key: string]: string;
    }): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: Company;
    }>;
    remove(id: string): Promise<Company>;
}
