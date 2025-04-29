import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hacker } from './hacker.entity';
import { HackerService } from './hacker.service';
import { HackerController } from './hacker.controller';
import { User } from 'src/user/user.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hacker, User]), CommonModule],
  controllers: [HackerController],
  providers: [HackerService],
  exports: [HackerService],
})
export class HackerModule {}
