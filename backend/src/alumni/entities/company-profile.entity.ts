import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Alumni } from './alumni.entity';

@Entity()
export class CompanyProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alumni, alumni => alumni.companyProfiles)
  alumni: Alumni;

  @Column()
  companyName: string;

  @Column()
  establishmentYear: number;

  @Column()
  employeeCount: number;

  @Column('decimal')
  turnover: number; // In crores

  @Column()
  isFounder: boolean; // Founder or co-founder

  @Column()
  isFirstGeneration: boolean;

  @Column({ nullable: true })
  isUnrelatedToFamilyBusiness: boolean;

  @Column()
  entityType: string; // Private Limited, Public Limited, etc.

  @Column()
  registrationNumber: string;

  @Column()
  registrationDate: Date;

  @Column()
  registeredAddress: string;

  @Column()
  registrationPlace: string;

  @Column({ nullable: true })
  registrationCertificateId: string; // Reference to FileUpload entity

  @Column()
  businessDomain: string;

  @Column('text')
  innovations: string;

  @Column({ default: false })
  hasIpr: boolean;

  @Column('json', { nullable: true })
  iprDetails: {
    type: string;
    description: string;
    registrationNumber: string;
    documentId: string; // Reference to FileUpload entity
  }[];

  @Column({ default: false })
  hasMergers: boolean;

  @Column('json', { nullable: true })
  mergerDetails: {
    corporateName: string;
    transactionType: string;
    year: number;
    description: string;
    documentId: string; // Reference to FileUpload entity
  }[];

  @Column({ default: false })
  hasForeignCollaborations: boolean;

  @Column('text', { nullable: true })
  foreignCollaborationDetails: string;

  @Column('json', { nullable: true })
  awards: {
    name: string;
    awardedBy: string;
    level: string;
    category: string;
    year: number;
    description: string;
    documentId: string; // Reference to FileUpload entity
  }[];

  @Column('json', { nullable: true })
  academicCollaborations: {
    institutionName: string;
    collaborationType: string;
    duration: string;
    outcomes: string;
    documentId: string; // Reference to FileUpload entity
  }[];

  @Column({ default: false })
  hasSustainabilityPractices: boolean;

  @Column('text', { nullable: true })
  sustainabilityDetails: string;

  @Column('text')
  ethicalPractices: string;
}
