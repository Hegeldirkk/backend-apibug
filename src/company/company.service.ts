import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  create(data: CreateCompanyDto) {
    const company = this.companyRepo.create(data);
    return this.companyRepo.save(company);
  }

  findAll() {
    return this.companyRepo.find();
  }

  async findOne(id: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Société non trouvée');
    return company;
  }

  async update(id: string, data: UpdateCompanyDto) {
    await this.findOne(id); // Vérifie que la company existe
    await this.companyRepo.update(id, data);
    return this.findOne(id);
  }

  async updateCompanyInfo(
    userId: string,
    dto: UpdateCompanyDto,
    files?: { [key: string]: string },
  ) {
    const company = await this.companyRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  
    if (!company) {
      return { status: 404, message: 'Entreprise non trouvée' };
    }
  
    // Mise à jour des champs classiques
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) {
        company[key] = value;
      }
    });
  
    // Mise à jour des fichiers
    if (files?.logo) company.logo = files.logo;
    if (files?.registre_commerce) company.registre_commerce = files.registre_commerce;
  
    await this.companyRepo.save(company);
  
    return {
      status: 200,
      message: 'Entreprise mise à jour avec succès',
      data: company,
    };
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    return this.companyRepo.remove(company);
  }
}
