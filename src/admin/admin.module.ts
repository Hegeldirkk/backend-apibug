import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/user/user.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';
import { Program } from 'src/programs/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Hacker, Company, Program])],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
