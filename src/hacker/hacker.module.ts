import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hacker } from './hacker.entity';
import { HackerService } from './hacker.service';
import { HackerController } from './hacker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hacker])],
  controllers: [HackerController],
  providers: [HackerService],
  exports: [HackerService],
})
export class HackerModule {}
