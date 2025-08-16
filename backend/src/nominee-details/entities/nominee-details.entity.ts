// X:\Projects\Entrepreneur\entrepreneur-award\src\nominee-details\entities\nominee-details.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Award } from './award.entity';
import { Ipr } from './ipr.entity';
import { Merger } from './merger.entity';
import { Collaboration } from './collaboration.entity';
import { FounderType } from '../../enums/enums';

@Entity('nominee_details')
export class NomineeDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.nomineeDetails)
  user: User;

  @Column({ type: 'integer', nullable: true })
  passoutYear: number | null;

  @Column({ type: 'text', nullable: true })
  photo: string | null;

  @Column({ type: 'text', nullable: true })
  companyName: string | null;

  @Column({ type: 'text', nullable: true })
  companyType: string | null;

  @Column({ type: 'text', nullable: true })
  companyWebsite: string | null;

  @Column({ type: 'text', nullable: true })
  registrationNumber: string | null;

  @Column({ type: 'text', nullable: true }) // Changed from 'date' to 'text'
  registrationDate: string | null; // Changed type from Date to string

  @Column({ type: 'text', nullable: true })
  registeredAddress: string | null;

  @Column({ type: 'text', nullable: true })
  registrationPlace: string | null;

  @Column({ type: 'text', nullable: true })
  registrationCertificate: string | null;

  @Column({ type: 'enum', enum: FounderType, nullable: true })
  founderType: FounderType | null;

  @Column({ type: 'text', nullable: true })
  companyDescription: string | null;

  @Column({ type: 'integer', nullable: true })
  yearOfEstablishment: number | null;

  @Column({ type: 'integer', nullable: true })
  totalEmployees: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  annualTurnover: number | null;

  @Column({ type: 'text', nullable: true })
  businessDomain: string | null;

  @Column({ type: 'text', nullable: true })
  keyInnovations: string | null;

  @Column({ type: 'boolean', default: false })
  isFirstGeneration: boolean;

  @Column({ type: 'boolean', default: false })
  isUnrelatedToFamily: boolean;

  @Column({ type: 'boolean', default: false })
  hasIprs: boolean;

  @Column({ type: 'boolean', default: false })
  hasMergers: boolean;

  @Column({ type: 'boolean', default: false })
  hasCollaborations: boolean;

  @Column({ type: 'boolean', default: false })
  hasAwards: boolean;

  @Column({ type: 'boolean', default: false })
  hasForeignPresence: boolean;

  @Column({ type: 'boolean', default: false })
  hasSustainability: boolean;

  @Column({ type: 'text', nullable: true })
  iprDescription: string | null;

  @Column({ type: 'text', nullable: true })
  foreignDescription: string | null;

  @Column({ type: 'text', nullable: true })
  sustainabilityDescription: string | null;

  @Column({ type: 'text', nullable: true })
  ethicsDescription: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Award, award => award.nominee)
  awards: Award[];

  @OneToMany(() => Ipr, ipr => ipr.nominee)
  iprs: Ipr[];

  @OneToMany(() => Merger, merger => merger.nominee)
  mergers: Merger[];

  @OneToMany(() => Collaboration, collaboration => collaboration.nominee)
  collaborations: Collaboration[];
}