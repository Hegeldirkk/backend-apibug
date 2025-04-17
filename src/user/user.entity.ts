import { Company } from 'src/company/company.entity';
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

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp_code: string;

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

  @Column({ nullable: true })
  emailRecuperation?: string;

  @Column({ nullable: true })
  emailChangePending?: string;

  @Column({ nullable: true })
  emailChangeToken?: string;

  @Column('simple-array', { nullable: true })
  codesRecuperation?: string[];

  @Column('simple-array', { nullable: true })
  usedRecoveryCodes?: string[];

  @Column({ default: true })
  compteDesactivable: boolean;

  @Column({ default: true })
  compteSupprimable: boolean;

  @Column({
    type: 'enum',
    enum: StatutCompte,
    default: StatutCompte.PENDING,
  })
  statutCompte: StatutCompte;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verificationSentAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Company, (company) => company.user)
  company: Company;
}
