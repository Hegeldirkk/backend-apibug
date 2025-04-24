import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  nom?: string;

  @Column({ nullable: true })
  prenom?: string;

  @Column({ nullable: true })
  contact?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
