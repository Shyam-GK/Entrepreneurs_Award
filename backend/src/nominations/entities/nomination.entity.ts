// X:\Projects\Entrepreneur\entrepreneur-award\src\nominations\entities\nomination.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NominationStatus } from '../../enums/enums';

@Entity('nominations')
@Unique(['nominator', 'nomineeEmail']) // keep in ORM-level too
export class Nomination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.nominationsAsNominator)
  nominator: User;

  @ManyToOne(() => User, user => user.nominationsAsNominee, { nullable: true })
  nomineeUser: User | null;

  @Column({ type: 'text' })
  nomineeEmail: string;

  @Column({ type: 'text' })
  nomineeName: string;

  @Column({ type: 'text', nullable: true })
  nomineeMobile: string | null;

  @Column({ type: 'text', nullable: true })
  relationship: string | null;

  @Column({ type: 'enum', enum: NominationStatus, default: NominationStatus.Pending })
  status: NominationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  nominatedAt: Date;
}
