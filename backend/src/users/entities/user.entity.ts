import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { NomineeDetails } from '../../nominee-details/entities/nominee-details.entity';
import { Otp } from '../../otps/entities/otp.entity';
import { UserRole } from '../../enums/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  mobile: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ type: 'text', default: 'unknown' })
  course: string;

  @Column({ type: 'text', nullable: true })
  programme: string;

  @Column({ type: 'text', nullable: true })
  graduatedYear: string;

  @OneToMany(() => Nomination, nomination => nomination.nominator)
  nominationsAsNominator: Nomination[];

  @OneToMany(() => Nomination, nomination => nomination.nomineeUser)
  nominationsAsNominee: Nomination[];

  @OneToMany(() => NomineeDetails, nomineeDetails => nomineeDetails.user)
  nomineeDetails: NomineeDetails[];

  @OneToMany(() => Otp, otp => otp.user)
  otps: Otp[];
}
