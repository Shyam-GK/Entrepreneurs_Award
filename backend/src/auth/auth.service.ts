import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OtpsService } from '../otps/otps.service';
import { ForgotPasswordDto } from '../users/dto/forgot-password.dto';
import { VerifyOtpDto } from '../users/dto/verify-otp.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpsService: OtpsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
      const existing = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
      if (existing) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      const dummyInitialPassword = "@x8Q#z1S!p$RkL7^eFwV"; // Use a dummy initial password
      const user = this.usersRepository.create({ ...createUserDto, email: createUserDto.email.toLowerCase(), password: dummyInitialPassword });
      return this.usersRepository.save(user);
    }
  /**
   * Validate credentials for login
   * returns user object without password if valid, otherwise null
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      // user.password exists (hashed)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;
      // strip password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...result } = user as any;
      return result;
    } catch (err) {
      // user not found or other error -> invalid credentials
      return null;
    }
  }

  /**
   * Issue access and refresh tokens
   */
  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '60m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Send OTP for password reset
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    // throws if user not found
    await this.usersService.findByEmail(forgotPasswordDto.email);
    await this.otpsService.generateOtp(forgotPasswordDto.email);
    return { message: 'OTP sent to your email' };
  }

  /**
   * Verify OTP
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const isValid = await this.otpsService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    if (isValid) {
      return { message: 'OTP verified successfully' };
    }
    throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
  }

  /**
   * Reset password after OTP verification
   *
   * NOTE: This implementation expects ResetPasswordDto to have:
   *   { email, otp, password, reEnterPassword }
   *
   * If your DTO uses different field names (e.g. newPassword/confirmPassword),
   * either adapt the DTO or change the checks below.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    // Validate passwords match
    if (resetPasswordDto.password !== resetPasswordDto.reEnterPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    // Verify OTP (throws on invalid/expired)
    const isValid = await this.otpsService.verifyOtp(resetPasswordDto.email, resetPasswordDto.otp);
    if (!isValid) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Update password via UsersService (UsersService will hash the password)
    await this.usersService.updatePassword(resetPasswordDto.email, resetPasswordDto.password);

    // clear OTPs for this user
    await this.otpsService.clearOtp(resetPasswordDto.email);

    return { message: 'Password reset successfully. Please login.' };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '60m' },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
