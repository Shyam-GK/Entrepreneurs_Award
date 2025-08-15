// src/nominee-details/entities/ipr.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NomineeDetails } from './nominee-details.entity';

@Entity('iprs')
export class Ipr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NomineeDetails, nomineeDetails => nomineeDetails.iprs, { onDelete: 'CASCADE' })
  nominee: NomineeDetails;

  @Column({ type: 'text', nullable: true })
  type: string | null;

  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  registrationNumber: string | null;

  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
