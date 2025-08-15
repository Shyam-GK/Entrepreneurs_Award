// X:\Projects\Entrepreneur\entrepreneur-award\src\users\dto\create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsMobilePhone , IsOptional} from 'class-validator';
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
  @IsOptional() // make password optional for initial registration
  password: string;

  @IsEnum(UserRole)
  @IsOptional()              // make role optional since it has a default
  role: UserRole = UserRole.User;  // default value
}