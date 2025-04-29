import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Report } from 'src/report/report.entity';

@Entity('hackers')
export class Hacker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ unique: true })
  pseudo: string;

  @Column({ type: 'enum', enum: ['M', 'F'], nullable: true })
  sexe: 'M' | 'F';

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ type: 'date', nullable: true })
  dateNaissance: Date;

  @Column({ nullable: true })
  siteWeb: string;

  @Column({ type: 'text', nullable: true })
  aPropos: string;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'json', nullable: true })
  reseauxSociaux: { nom: string; lien: string }[];

  @Column({ default: true })
  publique: boolean;

  @Column({
    type: 'enum',
    enum: ['Novice', 'Intermediaire', 'Expert'],
    nullable: true,
  })
  niveau: 'Novice' | 'Intermediaire' | 'Expert';

  // Relations
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Report, (report) => report.hacker)
  reports: Report[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
