import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NomineeDetailsService } from './nominee-details.service';
import { NomineeDetailsController } from './nominee-details.controller';
import { NomineeDetails } from './entities/nominee-details.entity';
import { Award } from './entities/award.entity';
import { Ipr } from './entities/ipr.entity';
import { Merger } from './entities/merger.entity';
import { Collaboration } from './entities/collaboration.entity';
import { GraduationDetail } from './entities/graduation-detail.entity';
import { UsersModule } from '../users/users.module';
import { NominationsModule } from '../nominations/nominations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NomineeDetails,
      Award,
      Ipr,
      Merger,
      Collaboration,
      GraduationDetail,
    ]),
    UsersModule,
    NominationsModule,
  ],
  controllers: [NomineeDetailsController],
  providers: [NomineeDetailsService],
})
export class NomineeDetailsModule {}