import { IsString, IsNotEmpty, IsEmail, IsEnum, IsMobilePhone, IsOptional, Matches } from 'class-validator';
import { UserRole } from '../../enums/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole = UserRole.User;

  @IsString()
  course: string;

  @IsString()
  programme: string;

  @IsString()
  graduatedYear: string;
}
