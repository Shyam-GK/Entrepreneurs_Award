// X:\Projects\Entrepreneur\entrepreneur-award\src\nominations\dto\create-nomination.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateNominationDto {
  @IsEmail()
  @IsNotEmpty()
  nomineeEmail: string;

  @IsString()
  @IsNotEmpty()
  nomineeName: string;
}