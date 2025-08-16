// X:\Projects\Entrepreneur\entrepreneur-award\src\app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { NominationsModule } from './nominations/nominations.module';
import { NomineeDetailsModule } from './nominee-details/nominee-details.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { OtpsModule } from './otps/otps.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'your-username',
      password: process.env.DB_PASSWORD || 'your-password',
      database: process.env.DB_NAME || 'your-database',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
      logging: true,
    }),
    UsersModule,
    NominationsModule,
    NomineeDetailsModule,
    AdminModule,
    AuthModule,
    OtpsModule,
    ProfileModule,
  ],
})
export class AppModule {}