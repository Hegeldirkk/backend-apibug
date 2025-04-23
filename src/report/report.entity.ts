// src/reports/entities/report.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Hacker } from 'src/hacker/hacker.entity';
import { Program } from 'src/programs/program.entity';
import { ReportMessage } from 'src/report-message/report-message.entity';

export enum ReportStatus {
  EN_ATTENTE = 'en_attente',
  VALIDE = 'validé',
  REJETE = 'rejeté',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column({ type: 'json', nullable: true })
  preuves: { url: string; type: string }[];

  @Column({ type: 'json', nullable: true })
  vulnerability: string[];

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.EN_ATTENTE,
  })
  statut: ReportStatus;

  @ManyToOne(() => Hacker, (hacker) => hacker.reports, {
    onDelete: 'CASCADE',
  })
  hacker: Hacker;

  @Column()
  markdown?: string;

  @ManyToOne(() => Program, (program) => program.reports, {
    onDelete: 'CASCADE',
  })
  program: Program;

  @OneToMany(() => ReportMessage, (msg) => msg.report)
  messages: ReportMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
