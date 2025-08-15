// src/alumni/alumni.module.ts (Ensure MulterModule is included)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumni } from './entities/alumni.entity';
import { CompanyProfile } from './entities/company-profile.entity';
import { FileUpload } from './entities/file-upload.entity';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alumni, CompanyProfile, FileUpload]),
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with env variable in production
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [AlumniService],
  controllers: [AlumniController],
  exports: [AlumniService],
})
export class AlumniModule {}