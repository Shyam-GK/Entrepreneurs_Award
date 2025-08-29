import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NomineeDetails } from './nominee-details.entity';

@Entity('graduation_details')
export class GraduationDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NomineeDetails, nomineeDetails => nomineeDetails.graduationDetails, { onDelete: 'CASCADE' })
  nominee: NomineeDetails;

  @Column({ type: 'text', nullable: true })
  degree: string | null;

  @Column({ type: 'text', nullable: true })
  institution: string | null;

  @Column({ type: 'int', nullable: true })
  graduationYear: number | null;
}