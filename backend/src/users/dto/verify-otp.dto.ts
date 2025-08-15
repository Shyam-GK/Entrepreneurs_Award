// X:\Projects\Entrepreneur\entrepreneur-award\src\users\dto\verify-otp.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}