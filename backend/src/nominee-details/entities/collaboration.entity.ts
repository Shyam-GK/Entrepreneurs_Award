// src/nominee-details/entities/collaboration.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NomineeDetails } from './nominee-details.entity';

@Entity('collaborations')
export class Collaboration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NomineeDetails, nomineeDetails => nomineeDetails.collaborations, { onDelete: 'CASCADE' })
  nominee: NomineeDetails;

  @Column({ type: 'text', nullable: true })
  institutionName: string | null;

  @Column({ type: 'text', nullable: true })
  type: string | null;

  @Column({ type: 'text', nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  outcomes: string | null;

  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
