// src/report-message/entities/report-message.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Report } from 'src/report/report.entity';
import { Hacker } from 'src/hacker/hacker.entity';
import { Company } from 'src/company/company.entity';

export type SenderType = 'hacker' | 'company';

@Entity('report_messages')
export class ReportMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  files?: { type: 'image' | 'video' | 'autre'; url: string }[];

  @Column()
  senderType: SenderType;

  @Column({ default: false })
  readByHacker: boolean;

  @Column({ default: false })
  readByCompany: boolean;

  @ManyToOne(() => Hacker, { nullable: true, eager: false })
  hacker: Hacker;

  @ManyToOne(() => Company, { nullable: true, eager: false })
  company: Company;

  @ManyToOne(() => Report, (report) => report.messages, {
    onDelete: 'CASCADE',
  })
  report: Report;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
