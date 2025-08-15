// src/nominee-details/entities/award.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NomineeDetails } from './nominee-details.entity';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NomineeDetails, nomineeDetails => nomineeDetails.awards, { onDelete: 'CASCADE' })
  nominee: NomineeDetails;

  @Column({ type: 'text', nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  awardedBy: string | null;

  @Column({ type: 'text', nullable: true })
  level: string | null;

  @Column({ type: 'text', nullable: true })
  category: string | null;

  @Column({ type: 'integer', nullable: true })
  yearReceived: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
