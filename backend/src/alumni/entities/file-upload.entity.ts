import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Alumni } from './alumni.entity';

@Entity()
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alumni, alumni => alumni.files)
  alumni: Alumni;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  path: string; // e.g., uploads/photo/, uploads/registration/, etc.

  @Column()
  type: 'PHOTO' | 'REGISTRATION' | 'IPR' | 'MERGER' | 'AWARD' | 'ACADEMIC_COLLAB';

  @Column()
  createdAt: Date;
}