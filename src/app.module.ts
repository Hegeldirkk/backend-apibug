import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company/company.entity';
import { User } from './user/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Hacker } from './hacker/hacker.entity';
import { Program } from './programs/program.entity';
import { ProgramModule } from './programs/program.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bugproject',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ❗ À désactiver en prod
    }),
    AuthModule,
    ProgramModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
