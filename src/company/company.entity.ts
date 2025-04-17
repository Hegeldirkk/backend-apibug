import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
  @Entity('companies')
  export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // 📌 Informations Générales
    @Column({ nullable: true })
    nom?: string;
  
    @Column({ nullable: true, type: 'text' })
    description?: string;
  
    @Column({ nullable: true })
    type_entreprise?: string;
    
    @Column({ nullable: true })
    email_company?: string;

    @Column({ nullable: true })
    language?: string;

    @Column({ nullable: true })
    secteur?: string;
  
    @Column({ nullable: true })
    statut_actuel?: string;
  
    @Column({ default: false })
    verified: boolean;
  
    // ☎️ Coordonnées & Contact
    @Column({ nullable: true })
    responsable_nom_complet: string;

    @Column({ nullable: true })
    responsable_contact?: string;
  
    @Column({ nullable: true })
    fix?: string;
  
    @Column({ nullable: true })
    adresse?: string;
  
    @Column({ nullable: true })
    urlSite?: string;
  
    // 🔑 Identité & Vérification
    @Column({ nullable: true })
    num_identification?: string;
  
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
  
    @Column({ nullable: true })
    pushToken?: string;
  
    // 🏦 Informations Financières & Légales
    @Column({ nullable: true })
    registre_commerce?: string;
  
    @Column({ nullable: true, type: 'date' })
    date_creation?: Date;
  
    // 🌍 Localisation
    @Column({ nullable: true })
    longitude?: string;

    @Column({ nullable: true })
    latitude?: string;
    
  
    @Column({ nullable: true })
    pays?: string;
  
    // 👥 Réseaux Sociaux
    @Column('simple-array', { nullable: true })
    reseaux_sociaux?: string[];
  
    // 🕒 Informations Opérationnelles
    @Column({ nullable: true })
    horaires_ouverture?: string;
  
    @Column('simple-array', { nullable: true })
    langues?: string[];
  
    // 💳 Paiements et Services
    @Column('simple-array', { nullable: true })
    modes_paiement?: string[];
  
    @Column('simple-array', { nullable: true })
    services?: string[];
  
    // 👤 Responsable
    @Column({ nullable: true })
    responsable?: string;
  
    // 📸 Médias & Documents
    @Column({ nullable: true })
    logo?: string;
  
    @Column('simple-array', { nullable: true })
    documents?: string[];
  
    // Timestamps
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  