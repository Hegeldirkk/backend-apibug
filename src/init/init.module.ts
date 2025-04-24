// src/init/init.module.ts

import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Admin } from 'src/admin/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  providers: [InitService],
})
export class InitModule {}
