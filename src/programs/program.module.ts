import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './program.entity';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Company } from '../company/company.entity';
import { UploadModule } from 'src/common/upload/upload.module';
import { CommonModule } from 'src/common/common.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Company, User]), UploadModule, CommonModule],
  providers: [ProgramService],
  controllers: [ProgramController],
  exports: [TypeOrmModule],
})
export class ProgramModule {}
