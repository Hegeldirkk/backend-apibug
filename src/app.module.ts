import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { ProgramModule } from './programs/program.module';
import { ReportModule } from './report/report.module';
import { HackerModule } from './hacker/hacker.module';
import { InitModule } from './init/init.module';
import { AdminModule } from './admin/admin.module';
import { ReportMessageModule } from './report-message/report-message.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'bounty',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Désactiver en production
      //connectTimeout: 30000, // Timeout augmenté à 30 sec
      
    }),
    /*TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bugproject',
      entities: [__dirname + '//*.entity{.ts,.js}'],
      synchronize: true, // ❗ À désactiver en prod
    }),*/
    AuthModule,
    ProgramModule,
    ReportModule,
    HackerModule,
    InitModule,
    AdminModule,
    ReportMessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
