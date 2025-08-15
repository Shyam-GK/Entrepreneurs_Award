// nominee-details.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NomineeDetails } from './entities/nominee-details.entity';
import { Award } from './entities/award.entity';
import { Ipr } from './entities/ipr.entity';
import { Merger } from './entities/merger.entity';
import { Collaboration } from './entities/collaboration.entity';
import { User } from '../users/entities/user.entity';
import { NomineeDetailsController } from './nominee-details.controller';
import { NomineeDetailsService } from './nominee-details.service';
import { NominationsModule } from '../nominations/nominations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NomineeDetails, User, Award, Ipr, Merger, Collaboration]),
    NominationsModule,
  ],
  controllers: [NomineeDetailsController],
  providers: [NomineeDetailsService],
})
export class NomineeDetailsModule {}
