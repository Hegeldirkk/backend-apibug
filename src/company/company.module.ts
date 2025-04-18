import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CommonModule } from 'src/common/common.module';
import { Program } from 'src/programs/program.entity';
import { UploadModule } from 'src/common/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Program]), CommonModule, UploadModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
