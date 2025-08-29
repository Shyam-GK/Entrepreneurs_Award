import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { OtpsModule } from '../otps/otps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => OtpsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService], // Export TypeOrmModule to provide UserRepository
})
export class UsersModule {}