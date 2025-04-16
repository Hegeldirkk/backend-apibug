import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CommonModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
