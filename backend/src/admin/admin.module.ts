import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { NomineeDetails } from '../nominee-details/entities/nominee-details.entity';
import { Award } from '../nominee-details/entities/award.entity';
import { Ipr } from '../nominee-details/entities/ipr.entity';
import { Merger } from '../nominee-details/entities/merger.entity';
import { Collaboration } from '../nominee-details/entities/collaboration.entity';
import { Nomination } from '../nominations/entities/nomination.entity';
import { User } from '../users/entities/user.entity'; // Import User entity
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NomineeDetails,
      Award,
      Ipr,
      Merger,
      Collaboration,
      Nomination,
      User, // Include User entity here for local repository
    ]),
    UsersModule, // Import UsersModule to access UserRepository
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}