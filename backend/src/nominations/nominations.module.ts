// X:\Projects\Entrepreneur\entrepreneur-award\src\nominations\nominations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { Nomination } from './entities/nomination.entity';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nomination]),
    UsersModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: config.get<boolean>('SMTP_SECURE') || true,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"Entrepreneur Award" <no-reply@entrepreneuraward.com>',
        },
        template: {
          dir: path.join(process.cwd(), 'src', 'templates'),  // changed to process.cwd() for consistency
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [NominationsService],
  controllers: [NominationsController],
  exports: [NominationsService],
})
export class NominationsModule {}
