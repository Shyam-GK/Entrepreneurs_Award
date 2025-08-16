import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class OtpsService {
  constructor(
    @InjectRepository(Otp)
    private otpsRepository: Repository<Otp>,

    @Inject(forwardRef(() => UsersService)) // ✅ force lazy injection
    private usersService: UsersService,

    private mailerService: MailerService,
  ) {}

  async generateOtp(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpsRepository.delete({ user: { id: user.id } });
    const otpRecord = this.otpsRepository.create({ user, otp, expiresAt });
    await this.otpsRepository.save(otpRecord);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      template: 'otp',
      context: { 
        otp, 
        expiresIn: 10, 
        name: user.name,
        supportEmail: process.env.SUPPORT_EMAIL
       },
    });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    const otpRecord = await this.otpsRepository.findOne({
      where: { user: { id: user.id }, otp },
      relations: ['user'],
    });
    if (!otpRecord) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otpRecord.expiresAt < new Date()) {
      await this.otpsRepository.delete({ id: otpRecord.id });
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async clearOtp(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    await this.otpsRepository.delete({ user: { id: user.id } });
  }
}
