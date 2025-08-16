// src/users/users.service.ts
import { Injectable, HttpException, HttpStatus,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OtpsService } from '../otps/otps.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private otpsService: OtpsService,
  ) {}

  // ✅ Signup
  async signup(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(newUser);

    // Send OTP after signup
    await this.otpsService.generateOtp(savedUser.email);

    return savedUser;
  }
  /**
   * Create a new user (registration)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, email: createUserDto.email.toLowerCase(), password: hashedPassword });
    return this.usersRepository.save(user);
  }

  // ✅ Forgot password → send OTP
  async sendOtp(email: string): Promise<void> {
    await this.otpsService.generateOtp(email);
  }

  // ✅ Verify OTP
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return this.otpsService.verifyOtp(email, otp);
  }

  // ✅ Reset password
  async resetPassword(
    email: string,
    otp: string,
    password: string,
    reEnterPassword: string,
  ): Promise<void> {
    if (password !== reEnterPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const isOtpValid = await this.verifyOtp(email, otp);
    if (!isOtpValid) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.update({ email }, { password: hashedPassword });

    // Clear OTP after successful reset
    await this.otpsService.clearOtp(email);
  }

  // ✅ Find user by email
  async findByEmail(email: string): Promise<User> {
    const e = email.toLowerCase();
    const user = await this.usersRepository.findOne({ where: { email: e } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ✅ Find user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // ✅ Update user profile
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }
  /**
   * Update password by email.
   * Accepts **plain** password and hashes it inside this method.
   */
  async updatePassword(email: string, newPasswordPlain: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
    const res = await this.usersRepository.update({ email }, { password: hashedPassword });
    if (res.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

}
