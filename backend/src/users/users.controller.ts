// src/users/users.controller.ts
import { Controller, Post, Body, Get, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Get logged-in user info
  @Get('me')
    async getMe(@Req() req: any) { // temporarily use 'any' to avoid TS errors
        const userId = req.user?.id; // safe access
        if (!userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.usersService.findById(userId);
        return {
            id: user.id,
            name: user.name,
            photo: (user as any).photo, // cast to any if TypeORM User entity doesn't have 'photo' typed
            isSubmitted: (user as any).isSubmitted,
        };
    }


  // ✅ Signup
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  // ✅ Forgot password → send OTP
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.usersService.sendOtp(dto.email);
    return { message: 'OTP sent to email' };
  }

  // ✅ Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const isValid = await this.usersService.verifyOtp(dto.email, dto.otp);
    if (!isValid) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }
    return { message: 'OTP verified successfully' };
  }

  // ✅ Reset password
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPassword(
      dto.email,
      dto.otp,
      dto.password,
      dto.reEnterPassword,
    );
    return { message: 'Password reset successfully' };
  }
}
