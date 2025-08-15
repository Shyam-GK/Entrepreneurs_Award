// X:\Projects\Entrepreneur\entrepreneur-award\src\users\dto\update-user.dto.ts
import { IsString, IsEmail, IsMobilePhone, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../enums/enums';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}