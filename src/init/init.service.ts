// src/init/init.service.ts

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, StatutCompte } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/admin/admin.entity';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async onApplicationBootstrap() {
    const superadminExists = await this.userRepo.findOne({
      where: { role: UserRole.SUPERADMIN },
    });

    if (!superadminExists) {
      const password = await bcrypt.hash('Super@Admin123', 10);
      const superadmin = this.userRepo.create({
        email: 'superadmin@bugbuster.com',
        password,
        role: UserRole.SUPERADMIN,
        verified: true,
        statutCompte: StatutCompte.ACTIF,
      });

      await this.userRepo.save(superadmin);

      const admin = this.adminRepo.create({
        user: superadmin,
      });

      await this.adminRepo.save(admin);

      console.log('✅ Superadmin créé avec succès');
    } else {
      console.log('ℹ️ Superadmin déjà existant');
    }
  }
}
