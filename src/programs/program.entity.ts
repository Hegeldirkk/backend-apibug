import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from '../company/company.entity';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  prix_bas: string;

  @Column({ nullable: true })
  prix_moyen: string;

  @Column({ nullable: true })
  prix_eleve?: string;

  @Column({ nullable: true })
  prix_critique?: string;

  @Column({ type: 'json', nullable: true })
  inscope: Array<{
    type: string;
    target: string;
    description: string;
  }>;

  @ManyToOne(() => Company, (company) => company.programs, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column({ nullable: true })
  markdown: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
