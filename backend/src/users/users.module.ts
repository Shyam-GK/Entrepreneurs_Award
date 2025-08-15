// X:\Projects\Entrepreneur\entrepreneur-award\src\users\users.module.ts
import { Module ,forwardRef  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { OtpsModule } from '../otps/otps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => OtpsModule), // ✅ Break the loop if needed
  ],
  providers: [UsersService],
  exports: [UsersService],
  
})
export class UsersModule {}