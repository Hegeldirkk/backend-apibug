import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(dto: CreateCompanyDto): Promise<import("./company.entity").Company>;
    updateCompany(req: any, dto: UpdateCompanyDto, files: Express.Multer.File[]): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: import("./company.entity").Company;
    }>;
    findAll(): Promise<import("./company.entity").Company[]>;
    findOne(id: string): Promise<import("./company.entity").Company>;
    update(id: string, dto: UpdateCompanyDto): Promise<import("./company.entity").Company>;
    remove(id: string): Promise<import("./company.entity").Company>;
}
