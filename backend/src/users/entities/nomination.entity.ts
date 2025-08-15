import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('nominations')
@Unique(['nominator', 'nomineeEmail'])
export class Nomination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.nominationsAsNominator)
  nominator: User;

  @Column()
  nomineeEmail: string;

  @Column()
  nomineeName: string;

  @Column({ default: 'Pending' })
  status: 'Pending' | 'Registered' | 'Submitted';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  nominatedAt: Date;

  @ManyToOne(() => User, user => user.nominationsAsNominee, { nullable: true })
  nomineeUser: User;
}
