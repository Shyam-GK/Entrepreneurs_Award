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
import { ProfileModule } from './profile/profile.module'; // Added ProfileModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    UsersModule,
    NominationsModule,
    NomineeDetailsModule,
    AdminModule,
    AuthModule,
    OtpsModule,
    ProfileModule, // Added to imports
  ],
})
export class AppModule {}