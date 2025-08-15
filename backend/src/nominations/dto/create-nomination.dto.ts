// src/nominations/dto/create-nomination.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateNominationDto {
  @IsEmail()
  nomineeEmail: string;

  @IsString()
  nomineeName: string;

  @IsString()
  @IsOptional()
  nomineeMobile?: string;

  @IsString()
  @IsOptional()
  relationship?: string;
}
