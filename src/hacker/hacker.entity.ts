import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
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
    email: string;
  
    @Column({ nullable: true })
    adresse: string;
  
    @Column({ nullable: true })
    contact: string;
  
    @Column({ type: 'date', nullable: true })
    dateNaissance: Date;
  
    @Column({ nullable: true })
    pays: string;
  
    @Column({ nullable: true })
    siteWeb: string;
  
    @Column({ type: 'text', nullable: true })
    aPropos: string;
  
    @Column({ type: 'json', nullable: true })
    reseauxSociaux: { nom: string; lien: string }[];
  
    @Column({ nullable: true })
    photo: string;
  
    @Column({ default: true })
    publique: boolean;
  
    @Column({ nullable: true })
    pushToken: string;
  
    @Column({ type: 'enum', enum: ['Novice', 'Intermediaire', 'Expert'], nullable: true })
    niveau: 'Novice' | 'Intermediaire' | 'Expert';
  
    @Column({ type: 'json', nullable: true })
    infoPiece: {
      numeroPiece: string;
      dateExpiration: Date;
      profession: string;
      nationalite: string;
      nomPere: string;
      lieuNaissance: string;
      nomMere: string;
      numeroIdentification: string;
      rectoImage: string;
      versoImage: string;
    };
  
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  