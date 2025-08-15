import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { NomineeDetails } from '../nominee-details/entities/nominee-details.entity';
import { Award } from '../nominee-details/entities/award.entity';
import { Ipr } from '../nominee-details/entities/ipr.entity';
import { Merger } from '../nominee-details/entities/merger.entity';
import { Collaboration } from '../nominee-details/entities/collaboration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NomineeDetails, Award, Ipr, Merger, Collaboration])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}