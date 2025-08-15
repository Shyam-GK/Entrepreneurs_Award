// src/nominee-details/entities/merger.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NomineeDetails } from './nominee-details.entity';
import { MergerType } from '../../enums/enums';

@Entity('mergers')
export class Merger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NomineeDetails, nomineeDetails => nomineeDetails.mergers, { onDelete: 'CASCADE' })
  nominee: NomineeDetails;

  @Column({ type: 'text', nullable: true })
  mergerCompany: string | null;

  @Column({ type: 'enum', enum: MergerType, nullable: true })
  mergerType: MergerType | null;

  @Column({ type: 'integer', nullable: true })
  mergerYear: number | null;

  @Column({ type: 'text', nullable: true })
  mergerDescription: string | null;

  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
