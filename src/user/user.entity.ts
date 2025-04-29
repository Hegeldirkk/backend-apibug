import { Exclude } from 'class-transformer';
import { Admin } from 'src/admin/admin.entity';
import { Company } from 'src/company/company.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ENTREPRISE = 'company',
  HACKER = 'hacker',
}

export enum StatutCompte {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  SUSPENDU = 'suspendu',
  PENDING = 'pending',
  BANNI = 'banni',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  numeroTelephone: string;

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({ nullable: true })
  otp_code: string;

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({ nullable: true })
  otp_expire_at: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  docSet: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  // 🔐 Authentification & Sécurité
  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({ nullable: true })
  emailRecuperation?: string;

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column('simple-array', { nullable: true })
  codesRecuperation?: string[];

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column('simple-array', { nullable: true })
  usedRecoveryCodes?: string[];

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({
    type: 'enum',
    enum: StatutCompte,
    default: StatutCompte.PENDING,
  })
  statutCompte: StatutCompte;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @Exclude({ toPlainOnly: true }) // Par défaut on l'exclut de la réponse
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Company, (company) => company.user)
  company: Company;

  @OneToOne(() => Hacker, (hacker) => hacker.user)
  hacker: Hacker;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;
}
