import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Nomination} from '../../nominations/entities/nomination.entity';

import {CompanyProfile} from './company-profile.entity';
import {FileUpload} from './file-upload.entity';
@Entity()
export class Alumni {
    @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photoId: string; // Reference to FileUpload entity

  @Column()
  passoutYear: number;

  @Column({ default: false })
  isApplicationComplete: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @OneToMany(() => Nomination, nomination => nomination.nomineeName)
  nominations: Nomination[];

  @OneToMany(() => CompanyProfile, profile => profile.alumni)
  companyProfiles: CompanyProfile[];

  @OneToMany(() => FileUpload, file => file.alumni)
  files: FileUpload[];
}
